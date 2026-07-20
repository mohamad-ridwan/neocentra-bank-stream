import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { useDynamicRowHeight } from "react-window";
import { ReplyPost } from "@/types/stream.types";
import { generateMockReplies } from "@/models/stream";
import { prependConversationReplies } from "@/store/slices/streamSlice";

interface UseConversationRepliesProps {
  replies: ReplyPost[];
  parentStreamId: number;
  isLastPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Snapshot captured immediately before dispatching a prepend action.
 * Used by useLayoutEffect to restore scroll position in the same paint frame,
 * preventing any visible jump for the user.
 */
interface PrependSnapshot {
  /** scrollTop of the react-window inner list element before prepend */
  listScrollTopBefore: number;
  /** scrollHeight of the react-window inner list element before prepend */
  listScrollHeightBefore: number;
}

export function useConversationReplies({
  replies,
  parentStreamId,
  isLastPage,
  scrollContainerRef,
}: UseConversationRepliesProps) {
  const dispatch = useDispatch();
  const hasAutoScrolledRef = useRef(false);

  // Scroll lock: when true, the scroll sync listener will NOT update listElement.scrollTop.
  // This prevents the listener from clobbering our scroll restoration after a prepend.
  const scrollLockRef = useRef(false);

  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);

  // Mirror totalHeight in a ref so the scroll handler always reads the latest value
  // without needing to be re-registered (avoids the handleScroll() re-run that was
  // clobbering our corrected scrollTop after setTotalHeight triggered a re-render).
  const totalHeightRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);

  /**
   * Holds the snapshot taken just before a prepend dispatch so that
   * useLayoutEffect (which fires synchronously before browser paint) can
   * apply the exact scroll correction in one shot — eliminating the visible jump
   * that occurred when rAF polling started too late (after paint).
   */
  const prependSnapshotRef = useRef<PrependSnapshot | null>(null);

  /**
   * The expected replies.length value after the pending prepend completes.
   * useLayoutEffect watches replies.length; when it matches this value we know
   * the DOM has been updated and we can safely apply the scroll correction.
   */
  const expectedRepliesLengthRef = useRef<number | null>(null);

  /**
   * The stable target scrollTop set during the useLayoutEffect correction phase.
   * The rAF refinement loop MUST use this as its base anchor (not el.scrollTop)
   * to avoid compounding errors when the scroll sync handler races with the rAF loop.
   */
  const targetScrollTopRef = useRef<number | null>(null);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 100,
  });

  // Keep totalHeightRef in sync with totalHeight state
  useEffect(() => {
    totalHeightRef.current = totalHeight;
  }, [totalHeight]);

  const loadMore = useCallback(() => {
    // Prevent loading more until the initial auto-scroll to the bottom has occurred
    // and we are not currently locked (adjusting scroll after a prepend).
    if (!hasAutoScrolledRef.current || scrollLockRef.current) return;

    // Note: isLastPage is true if we CAN load more (in our custom inverted logic structure).
    // If false, we have reached the end of data.
    if (isLoading || !isLastPage) return;

    setIsLoading(true);

    setTimeout(() => {
      const startId = 20000 + replies.length;
      const count = 20;
      const newReplies = generateMockReplies(
        parentStreamId,
        startId,
        count,
        (index) => `Demo paginated reply #${index + 1}.`,
        "Paginated User",
      );

      const list_ = listRef.current;
      const listEl = list_?.element;

      if (list_ && listEl) {
        // === CAPTURE SNAPSHOT BEFORE STATE CHANGE ===
        // Record exact scroll metrics NOW, synchronously, before React processes
        // the dispatch. useLayoutEffect will read this and correct scrollTop
        // before the browser paints the next frame — zero visible jump.
        prependSnapshotRef.current = {
          listScrollTopBefore: listEl.scrollTop,
          listScrollHeightBefore: listEl.scrollHeight,
        };
        expectedRepliesLengthRef.current = replies.length + count;
        targetScrollTopRef.current = null;

        // Engage lock BEFORE dispatching so the scroll sync listener does not
        // interfere with the restoration we're about to perform.
        scrollLockRef.current = true;
      }

      // ⚠️ setIsLoading(false) BEFORE dispatch:
      // Doing this first ensures the rowCount changes (isLoading → false removes
      // the 2 skeleton rows) in the SAME React batch as the prepend. If we called
      // setIsLoading(false) AFTER dispatch, React would render TWO separate commits:
      // first adding items (jumping), then removing skeletons (jumping again).
      setIsLoading(false);

      // Dispatch triggers React reconciliation → DOM mutation → useLayoutEffect
      dispatch(prependConversationReplies({ replies: newReplies }));
    }, 3000);
  }, [isLoading, isLastPage, replies.length, parentStreamId, dispatch]);

  /**
   * PRIMARY SCROLL CORRECTION — runs synchronously after DOM mutation, before paint.
   *
   * useLayoutEffect fires synchronously after every DOM update but BEFORE the browser
   * has a chance to paint. This is the only place we can correct scrollTop without
   * the user ever seeing the intermediate "jumped" state.
   *
   * We watch `replies.length` so this fires as soon as the prepend re-render lands.
   */
  useLayoutEffect(() => {
    const snapshot = prependSnapshotRef.current;
    if (!snapshot) return;

    // Guard: only act once the array has grown to the expected length.
    if (
      expectedRepliesLengthRef.current !== null &&
      replies.length !== expectedRepliesLengthRef.current
    ) {
      return;
    }

    const listEl = listRef.current?.element;
    const wrapper = wrapperRef.current;
    const container = scrollContainerRef.current;
    if (!listEl || !wrapper || !container) return;

    // react-window has already inserted new rows at the top with default heights.
    // scrollHeight is now larger — compute the exact growth.
    const heightAdded = listEl.scrollHeight - snapshot.listScrollHeightBefore;

    // The target scrollTop keeps the previously-visible content at the same position.
    const targetScrollTop =
      snapshot.listScrollTopBefore + Math.max(0, heightAdded);

    // Persist the target so the rAF refinement loop always anchors from here,
    // not from el.scrollTop which may be dirty from the scroll sync handler.
    targetScrollTopRef.current = targetScrollTop;

    // Apply correction — this happens BEFORE paint, so the user never sees the jump.
    listEl.scrollTop = targetScrollTop;
    wrapper.style.height = `${listEl.scrollHeight}px`;
    container.scrollTop = targetScrollTop + wrapper.offsetTop;

    // Update the ref immediately (avoids re-registering the scroll listener via useState).
    // We also call setState to keep the React-controlled wrapperHeight value accurate,
    // but the ref ensures handleScroll() never reads a stale totalHeight.
    totalHeightRef.current = listEl.scrollHeight;
    setTotalHeight(listEl.scrollHeight);

    // Clear snapshot so subsequent renders don't reapply it
    prependSnapshotRef.current = null;
    expectedRepliesLengthRef.current = null;

    // === SECONDARY HEIGHT REFINEMENT (rAF loop) ===
    // react-window measures actual row heights asynchronously over several frames.
    // Each measurement causes scrollHeight to grow slightly. We anchor scrollTop
    // corrections to `targetScrollTopRef` (not el.scrollTop) to avoid compounding
    // errors from any concurrent scroll events that sneak past the lock.
    let lastHeight = listEl.scrollHeight;
    let stableFrames = 0;
    const MAX_STABLE = 3;
    const MAX_FRAMES = 20;

    const refineHeights = (frame: number) => {
      const el = listRef.current?.element;
      const w = wrapperRef.current;
      const c = scrollContainerRef.current;

      if (!el || !w || !c || frame >= MAX_FRAMES) {
        targetScrollTopRef.current = null;
        scrollLockRef.current = false;
        return;
      }

      const currentHeight = el.scrollHeight;

      if (currentHeight !== lastHeight) {
        // Height still growing — shift anchor scrollTop by the same delta
        // so the same content stays in view.
        const delta = currentHeight - lastHeight;
        const newScrollTop =
          (targetScrollTopRef.current ?? el.scrollTop) + delta;

        targetScrollTopRef.current = newScrollTop;

        el.scrollTop = newScrollTop;
        w.style.height = `${currentHeight}px`;
        c.scrollTop = newScrollTop + w.offsetTop;

        totalHeightRef.current = currentHeight;
        setTotalHeight(currentHeight);

        lastHeight = currentHeight;
        stableFrames = 0;
      } else {
        stableFrames++;
      }

      if (stableFrames >= MAX_STABLE) {
        // Height is stable — release the scroll lock
        targetScrollTopRef.current = null;
        scrollLockRef.current = false;
      } else {
        requestAnimationFrame(() => refineHeights(frame + 1));
      }
    };

    requestAnimationFrame(() => refineHeights(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies.length]);

  const onRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      // If we scroll near the top (which corresponds to older replies), trigger loadMore.
      // We check if startIndex <= 1 to trigger when close to or at the top.
      if (visibleRows.startIndex <= 1) {
        loadMore();
      }
    },
    [loadMore],
  );

  // Sync scroll height and list scrollTop on container scroll events.
  // NOTE: this effect depends only on `scrollContainerRef` (NOT totalHeight) so that
  // setTotalHeight calls inside the rAF loop do NOT tear down and re-register the
  // listener (which previously caused a spurious synchronous handleScroll() call that
  // overwrote our corrected scrollTop immediately after the layout correction).
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (
        !scrollContainerRef.current ||
        !wrapperRef.current ||
        !listRef.current
      )
        return;

      const listElement = listRef.current.element;
      if (!listElement) return;

      // Read totalHeight from the ref (always current, no closure staleness)
      // so we don't need totalHeight in the dependency array.
      const currentScrollHeight = listElement.scrollHeight;
      if (
        currentScrollHeight &&
        currentScrollHeight !== totalHeightRef.current
      ) {
        totalHeightRef.current = currentScrollHeight;
        setTotalHeight(currentScrollHeight);
      }

      // When locked, do NOT sync listElement.scrollTop — we are in the middle of a
      // scroll restoration and must not overwrite the target offset we just set.
      if (scrollLockRef.current) return;

      // Calculate how much the wrapper has scrolled past the top of the scroll container
      const scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop - wrapperRef.current.offsetTop,
      );
      listElement.scrollTop = scrollTop;
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef]);

  // Keep total height synced even when not scrolling (react-window measures items asynchronously)
  useEffect(() => {
    const interval = setInterval(() => {
      if (listRef.current && listRef.current.element) {
        const currentScrollHeight = listRef.current.element.scrollHeight;
        if (
          currentScrollHeight &&
          currentScrollHeight !== totalHeightRef.current
        ) {
          totalHeightRef.current = currentScrollHeight;
          setTotalHeight(currentScrollHeight);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [replies, isLoading]);

  const wrapperHeight = useMemo((): string | number => {
    return totalHeight || "100vh";
  }, [totalHeight]);

  // Reset refs when parentStreamId changes
  useEffect(() => {
    hasAutoScrolledRef.current = false;
    scrollLockRef.current = false;
    prependSnapshotRef.current = null;
    expectedRepliesLengthRef.current = null;
    targetScrollTopRef.current = null;
  }, [parentStreamId]);

  // Handle auto-scroll to latest messages (bottom) on first load
  useEffect(() => {
    if (
      parentStreamId &&
      replies.length > 0 &&
      !hasAutoScrolledRef.current &&
      totalHeight &&
      totalHeight > 100
    ) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        hasAutoScrolledRef.current = true;
        // Scroll to bottom instantly to prevent flashing top content and premature loadMore triggers
        scrollContainer.scrollTop = scrollContainer.scrollHeight;

        // Double check after a brief timeout to make sure it's at the absolute bottom
        const timer = setTimeout(() => {
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [parentStreamId, replies.length, totalHeight, scrollContainerRef]);

  return {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
    onRowsRendered,
    isLoading,
  };
}
