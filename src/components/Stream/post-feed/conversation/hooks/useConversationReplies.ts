import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

export function useConversationReplies({
  replies,
  parentStreamId,
  isLastPage,
  scrollContainerRef,
}: UseConversationRepliesProps) {
  const dispatch = useDispatch();

  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 100,
  });

  const loadMore = useCallback(() => {
    // Note: isLastPage is true if we CAN load more (in our custom inverted logic structure).
    // If false, we have reached the end of data.
    if (isLoading || !isLastPage) return;
    setIsLoading(true);

    // Save scroll state before prepending
    const scrollContainer = scrollContainerRef.current;
    let previousScrollHeight = 0;
    let previousScrollTop = 0;
    if (scrollContainer) {
      previousScrollHeight = scrollContainer.scrollHeight;
      previousScrollTop = scrollContainer.scrollTop;
    }

    setTimeout(() => {
      // Generate new replies
      // Unique startId = 20000 + current length
      const startId = 20000 + replies.length;
      const count = 15;
      const newReplies = generateMockReplies(
        parentStreamId,
        startId,
        count,
        (index) => `Demo paginated reply #${index + 1}.`,
        "Paginated User"
      );

      // Dispatch to Redux to prepend replies
      dispatch(prependConversationReplies({ replies: newReplies }));

      setIsLoading(false);

      // Restore scroll position to prevent viewport jumping
      setTimeout(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          const heightDifference = newScrollHeight - previousScrollHeight;
          scrollContainer.scrollTop = previousScrollTop + heightDifference;
        }
      }, 0);
    }, 3000);
  }, [isLoading, isLastPage, replies.length, parentStreamId, dispatch, scrollContainerRef]);

  const onRowsRendered = useCallback((visibleRows: { startIndex: number; stopIndex: number }) => {
    // If we scroll near the top (which corresponds to older replies), trigger loadMore
    // We check if startIndex <= 1 to trigger it when getting close to or reaching the top
    if (visibleRows.startIndex <= 1) {
      loadMore();
    }
  }, [loadMore]);

  // Sync scroll height and list scrollTop
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!scrollContainerRef.current || !wrapperRef.current || !listRef.current) return;

      const listElement = listRef.current.element;
      if (!listElement) return;

      // Update total height if it changed
      const currentScrollHeight = listElement.scrollHeight;
      if (currentScrollHeight && currentScrollHeight !== totalHeight) {
        setTotalHeight(currentScrollHeight);
      }

      // Calculate how much the wrapper has scrolled past the top of the scroll container
      const scrollTop = Math.max(0, scrollContainerRef.current.scrollTop - wrapperRef.current.offsetTop);
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
  }, [totalHeight, scrollContainerRef]);

  // Keep total height synced even when not scrolling (as react-window measures items asynchronously)
  useEffect(() => {
    const interval = setInterval(() => {
      if (listRef.current && listRef.current.element) {
        const currentScrollHeight = listRef.current.element.scrollHeight;
        if (currentScrollHeight && currentScrollHeight !== totalHeight) {
          setTotalHeight(currentScrollHeight);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [totalHeight, replies, isLoading]);

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
