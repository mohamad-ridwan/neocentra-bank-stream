import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDynamicRowHeight } from "react-window";
import { StreamPost } from "@/types/stream.types";
import { selectStreamsPagination } from "@/store/selectors/streamSelectors";
import { appendStreams } from "@/store/slices/streamSlice";
import { generateMockPosts } from "@/models/stream";

interface UsePostFeedProps {
  posts: StreamPost[];
}

export function usePostFeed({ posts }: UsePostFeedProps) {
  const dispatch = useDispatch();
  const pagination = useSelector(selectStreamsPagination);

  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);
  const totalHeightRef = useRef<number | null>(null);

  // Keep totalHeightRef in sync with totalHeight state
  useEffect(() => {
    totalHeightRef.current = totalHeight;
  }, [totalHeight]);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 245,
  });

  const isLastPage = useMemo(() => {
    return pagination?.is_last_page ?? false;
  }, [pagination?.is_last_page]);

  const loadMore = useCallback(() => {
    if (isLoading || isLastPage) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextStartId = posts.length + 1;
      const newPosts = generateMockPosts(nextStartId, 20);
      dispatch(appendStreams(newPosts));
      setIsLoading(false);
    }, 500);
  }, [isLoading, isLastPage, posts.length]);

  const onRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (visibleRows.stopIndex >= posts.length - 1) {
        loadMore();
      }
    },
    [loadMore, posts.length],
  );

  // Dynamically set viewport height and listen to window scroll to sync scrollTop
  useEffect(() => {
    let resizeRafId: number | null = null;
    const handleResize = () => {
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        setViewportHeight(window.innerHeight);
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let scrollRafId: number | null = null;
    const handleScroll = () => {
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        if (!wrapperRef.current || !listRef.current) return;

        const listElement = listRef.current.element;
        if (!listElement) return;

        // Batch all DOM reads first
        const currentScrollHeight = listElement.scrollHeight;
        const rect = wrapperRef.current.getBoundingClientRect();
        const scrollTop = Math.max(0, -rect.top);

        // Perform DOM writes & state updates after all reads
        if (
          currentScrollHeight &&
          currentScrollHeight !== totalHeightRef.current
        ) {
          totalHeightRef.current = currentScrollHeight;
          setTotalHeight(currentScrollHeight);
        }

        if (Math.abs(listElement.scrollTop - scrollTop) > 1) {
          listElement.scrollTop = scrollTop;
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Initial sync
    handleScroll();

    return () => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Keep total height synced even when not scrolling using ResizeObserver instead of polling setInterval
  useEffect(() => {
    let rafId: number | null = null;

    const checkScrollHeight = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
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
      });
    };

    // Check height immediately on mount or dependency change
    checkScrollHeight();

    const element = listRef.current?.element;
    if (!element || typeof ResizeObserver === "undefined") {
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    const observer = new ResizeObserver(() => {
      checkScrollHeight();
    });

    observer.observe(element);
    if (element.firstElementChild) {
      observer.observe(element.firstElementChild);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [posts]);

  const wrapperHeight = useMemo((): string | number => {
    return totalHeight || "100vh";
  }, [totalHeight]);

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
