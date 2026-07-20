import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { useDynamicRowHeight } from "react-window";
import { ReplyPost, StreamPost } from "@/types/stream.types";
import { generateMockReplies } from "@/models/stream";
import { prependConversationReplies } from "@/store/slices/streamSlice";

interface UseConversationRepliesProps {
  parent: StreamPost | null;
  replies: ReplyPost[];
  parentStreamId: number;
  isLastPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function useConversationReplies({
  parent,
  replies,
  parentStreamId,
  isLastPage,
  scrollContainerRef,
}: UseConversationRepliesProps) {
  const dispatch = useDispatch();
  const hasAutoScrolledRef = useRef(false);

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
      const startId = 20000 + replies.length;
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
    }, 1500);
  }, [isLoading, isLastPage, replies.length, parentStreamId, dispatch]);

  // Sync scroll height and list scrollTop on container scroll events.
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
        scrollContainer.scrollTop = scrollContainer.scrollHeight;

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
    isLoading,
    loadMore,
  };
}

