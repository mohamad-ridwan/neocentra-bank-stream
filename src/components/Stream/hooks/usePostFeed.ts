import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDynamicRowHeight } from "react-window";
import { StreamPost } from "@/types/stream.types";

interface UsePostFeedProps {
  posts: StreamPost[];
}

export function usePostFeed({ posts }: UsePostFeedProps) {
  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 150,
  });

  // Dynamically set viewport height and listen to window scroll to sync scrollTop
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!wrapperRef.current || !listRef.current) return;

      const listElement = listRef.current.element;
      if (!listElement) return;

      // Update total height if it changed
      const currentScrollHeight = listElement.scrollHeight;
      if (currentScrollHeight && currentScrollHeight !== totalHeight) {
        setTotalHeight(currentScrollHeight);
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      // Calculate how much the wrapper has scrolled past the top of the viewport
      const scrollTop = Math.max(0, -rect.top);
      listElement.scrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalHeight]);

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
  }, [totalHeight, posts]);

  const wrapperHeight = useMemo((): string | number => {
    return totalHeight || "100vh";
  }, [totalHeight]);

  return {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
  };
}
