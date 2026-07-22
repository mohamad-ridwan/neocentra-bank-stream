import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDynamicRowHeight } from "react-window";
import { ReplyPost, StreamPost } from "@/types/stream.types";
import { generateMockReplies } from "@/models/stream";
import {
  prependConversationReplies,
  setIsReplyAdded,
} from "@/store/slices/streamSlice";
import { selectIsReplyAdded } from "@/store/selectors/streamSelectors";

interface UseConversationRepliesProps {
  replies: ReplyPost[];
  parentStreamId: number;
  isLastPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function useConversationReplies({
  replies,
  parentStreamId,
  isLastPage,
  scrollContainerRef,
}: UseConversationRepliesProps) {
  const dispatch = useDispatch();
  const isReplyAdded = useSelector(selectIsReplyAdded);
  // const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const totalHeightRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 100,
    key: parentStreamId,
  });

  // Keep totalHeightRef in sync with totalHeight state
  useEffect(() => {
    totalHeightRef.current = totalHeight;
  }, [totalHeight]);

  const loadMore = useCallback(() => {
    if (isLoading || !isLastPage) return;

    setIsLoading(true);

    setTimeout(() => {
      const startId = 2000 + replies.length;
      const count = 20;
      const newReplies = generateMockReplies(
        parentStreamId,
        startId,
        count,
        (index) => `Demo paginated reply #${index + 1}.`,
        "Paginated User",
      );

      dispatch(prependConversationReplies({ replies: newReplies }));
      setIsLoading(false);
    }, 0);
  }, [isLoading, isLastPage, replies.length, parentStreamId, dispatch]);

  // Sync scroll height and list scrollTop on container scroll events.
  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        setViewportHeight(scrollContainerRef.current.clientHeight);
      } else {
        setViewportHeight(window.innerHeight);
      }
      setIsMobile(window.innerWidth < 768);
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

      const currentScrollHeight = listElement.scrollHeight;
      if (
        currentScrollHeight &&
        currentScrollHeight !== totalHeightRef.current
      ) {
        totalHeightRef.current = currentScrollHeight;
        setTotalHeight(currentScrollHeight);
      }

      // Calculate how much the wrapper has scrolled past the top of the scroll container
      const scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop - wrapperRef.current.offsetTop,
      );

      // Only set if they are different to prevent redundant scroll events and loops
      if (Math.abs(listElement.scrollTop - scrollTop) > 1) {
        listElement.scrollTop = scrollTop;
      }
    };

    const container = scrollContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!container) return;
      e.preventDefault();
      container.scrollTop -= e.deltaY;
    };

    let touchStartClientY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartClientY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && container) {
        const currentClientY = e.touches[0].clientY;
        const deltaY = currentClientY - touchStartClientY;
        container.scrollTop += deltaY;
        touchStartClientY = currentClientY;
        e.preventDefault();
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
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

  // Scroll to newest reply when a reply is added
  useEffect(() => {
    if (isReplyAdded) {
      if (
        parentStreamId &&
        replies.length > 0 &&
        totalHeight &&
        totalHeight > 100
      ) {
        const firstIndex = 0;
        if (listRef.current) {
          if (!listRef.current.scrollToItem) {
            listRef.current.scrollToItem = (
              index: number,
              align: "auto" | "center" | "end" | "smart" | "start" = "auto",
            ) => {
              if (typeof listRef.current.scrollToRow === "function") {
                listRef.current.scrollToRow({
                  index,
                  align,
                  behavior: "smooth",
                });
              }
            };
          }
          // 'start' is used because index 0 is physically at the top (visually the bottom due to scaleY(-1))
          listRef.current.scrollToItem(firstIndex, "start");
          dispatch(setIsReplyAdded(false));
        }
      }
    }
  }, [isReplyAdded, parentStreamId, replies.length, totalHeight, dispatch]);

  // Dynamically attach scroll listener to the virtualized list element to sync scrollTop back to the parent scroll container.
  // This prevents scroll jumping issues when user manual-scrolls after programmatic auto-scrolling.
  useEffect(() => {
    console.log("hooks rendered");
    if (listRef.current && listRef.current.element) {
      const listElement = listRef.current.element;
      if (!listElement._hasScrollListener) {
        listElement._hasScrollListener = true;
        const handleListScroll = () => {
          if (!scrollContainerRef.current || !wrapperRef.current) return;
          const targetParentScrollTop =
            listElement.scrollTop + wrapperRef.current.offsetTop;
          if (
            Math.abs(
              scrollContainerRef.current.scrollTop - targetParentScrollTop,
            ) > 1
          ) {
            scrollContainerRef.current.scrollTop = targetParentScrollTop;
          }
        };
        listElement.addEventListener("scroll", handleListScroll);
        listElement._cleanupScrollListener = () => {
          listElement.removeEventListener("scroll", handleListScroll);
          delete listElement._hasScrollListener;
          delete listElement._cleanupScrollListener;
        };
      }
    }
  });

  // Reset isReplyAdded and clean up the list scroll listener on unmount
  useEffect(() => {
    return () => {
      dispatch(setIsReplyAdded(false));
      if (listRef.current && listRef.current.element) {
        const listElement = listRef.current.element;
        if (typeof listElement._cleanupScrollListener === "function") {
          listElement._cleanupScrollListener();
        }
      }
    };
  }, [dispatch]);

  // Reset refs/state when parentStreamId changes
  // useEffect(() => {
  //   setHasAutoScrolled(false);
  // }, [parentStreamId]);

  // Handle auto-scroll to latest messages (bottom) on first load
  // useEffect(() => {
  //   if (isMobile) return;

  //   if (
  //     parentStreamId &&
  //     replies.length > 0 &&
  //     !hasAutoScrolled &&
  //     totalHeight &&
  //     totalHeight > 100
  //   ) {
  //     const scrollContainer = scrollContainerRef.current;
  //     if (scrollContainer) {
  //       let frameId: number;
  //       let lastHeight = scrollContainer.scrollHeight;
  //       let consecutiveMatches = 0;

  //       const checkAndScroll = () => {
  //         const container = scrollContainerRef.current;
  //         if (!container) return;

  //         const currentHeight = container.scrollHeight;
  //         // container.scrollTop = currentHeight;

  //         if (currentHeight === lastHeight) {
  //           consecutiveMatches++;
  //           if (consecutiveMatches >= 0) {
  //             setHasAutoScrolled(true);
  //             return;
  //           }
  //         } else {
  //           consecutiveMatches = 0;
  //           lastHeight = currentHeight;
  //         }

  //         frameId = requestAnimationFrame(checkAndScroll);
  //       };

  //       frameId = requestAnimationFrame(checkAndScroll);
  //       return () => cancelAnimationFrame(frameId);
  //     }
  //   }
  // }, [
  //   parentStreamId,
  //   replies.length,
  //   totalHeight,
  //   scrollContainerRef,
  //   hasAutoScrolled,
  //   isMobile,
  // ]);

  const isReady = useMemo(() => {
    // return replies.length === 0 || isMobile || hasAutoScrolled;
    return replies.length === 0 || isMobile || true;
  }, [replies.length, isMobile]);

  return {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
    isLoading,
    loadMore,
    isReady,
  };
}
