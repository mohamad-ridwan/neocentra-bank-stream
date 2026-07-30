import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDynamicRowHeight } from "react-window";
import { ReplyPost } from "@/types/stream.types";
import { generateMockReplies } from "@/models/stream";
import {
  prependConversationReplies,
  setIsReplyAdded,
} from "@/store/slices/streamSlice";
import {
  selectIsReplyAdded,
  selectActiveParentStreamId,
  selectActiveReplies,
  selectConversationPagination,
} from "@/store/selectors/streamSelectors";

interface UseConversationRepliesProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  replies?: ReplyPost[];
  parentStreamId?: number;
  isLastPage?: boolean;
}

export function useConversationReplies({
  scrollContainerRef,
  replies: propsReplies,
  parentStreamId: propsParentStreamId,
  isLastPage: propsIsLastPage,
}: UseConversationRepliesProps) {
  const dispatch = useDispatch();
  const isReplyAdded = useSelector(selectIsReplyAdded);
  const activeParentId = useSelector(selectActiveParentStreamId);
  const activeReplies = useSelector(selectActiveReplies);
  const pagination = useSelector(selectConversationPagination);

  const parentStreamId = useMemo(() => {
    return propsParentStreamId ?? activeParentId ?? 0;
  }, [propsParentStreamId, activeParentId]);
  const replies = useMemo(() => {
    return propsReplies ?? activeReplies ?? [];
  }, [propsReplies, activeReplies]);
  const isLastPage = useMemo(() => {
    return propsIsLastPage ?? pagination?.is_last_page ?? false;
  }, [propsIsLastPage, pagination]);
  // const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const totalHeightRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);

  const visibleStartIndexRef = useRef(0);
  const cachedHeightsRef = useRef<Map<number, number>>(new Map());
  const prevContainerWidthRef = useRef<number | null>(null);

  const rowHeightCore = useDynamicRowHeight({
    defaultRowHeight: 100,
    key: parentStreamId,
  });

  const rowHeight = useMemo(() => {
    return {
      getAverageRowHeight: () => rowHeightCore.getAverageRowHeight(),
      getRowHeight: (index: number) => {
        const height = rowHeightCore.getRowHeight(index);
        if (height !== undefined) {
          const oldHeight = cachedHeightsRef.current.get(index);
          if (oldHeight !== undefined && oldHeight !== height) {
            const delta = height - oldHeight;
            if (index < visibleStartIndexRef.current) {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop += delta;
              }
            }
          }
          cachedHeightsRef.current.set(index, height);
        }
        return height;
      },
      setRowHeight: (index: number, size: number) => {
        const oldHeight = cachedHeightsRef.current.get(index);
        if (oldHeight !== undefined && oldHeight !== size) {
          const delta = size - oldHeight;
          if (index < visibleStartIndexRef.current) {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop += delta;
            }
          }
        }
        cachedHeightsRef.current.set(index, size);
        rowHeightCore.setRowHeight(index, size);
      },
      observeRowElements: rowHeightCore.observeRowElements,
    };
  }, [rowHeightCore, scrollContainerRef]);

  const onResize = useCallback(
    ({ width }: { width: number; height: number }) => {
      const roundedWidth = Math.round(width);
      const prevWidth = prevContainerWidthRef.current;
      prevContainerWidthRef.current = roundedWidth;

      if (prevWidth && prevWidth !== roundedWidth) {
        const widthRatio = roundedWidth / prevWidth;
        const scaleFactor = Math.max(0.2, Math.min(5, 1 / widthRatio));

        cachedHeightsRef.current.forEach((oldH, index) => {
          if (index < visibleStartIndexRef.current) {
            const newH = Math.round(oldH * scaleFactor);
            cachedHeightsRef.current.set(index, newH);
            rowHeightCore.setRowHeight(index, newH);
          }
        });

        if (
          scrollContainerRef.current &&
          scrollContainerRef.current.scrollTop > 0
        ) {
          const newScrollTop = Math.round(
            scrollContainerRef.current.scrollTop * scaleFactor,
          );
          scrollContainerRef.current.scrollTop = newScrollTop;

          // Synchronize listElement.scrollTop immediately to prevent handleListScroll from snapping back
          if (
            listRef.current &&
            listRef.current.element &&
            wrapperRef.current
          ) {
            const listElement = listRef.current.element;
            const wrapperOffsetTop = wrapperRef.current.offsetTop;
            const newListScrollTop = Math.max(
              0,
              newScrollTop - wrapperOffsetTop,
            );
            listElement.scrollTop = newListScrollTop;
          }
        }
      }

      if (listRef.current && listRef.current.element) {
        const listElement = listRef.current.element;
        const currentScrollHeight = listElement.scrollHeight;
        if (
          currentScrollHeight &&
          currentScrollHeight !== totalHeightRef.current
        ) {
          totalHeightRef.current = currentScrollHeight;
          setTotalHeight(currentScrollHeight);
        }
      }
    },
    [rowHeightCore, scrollContainerRef, wrapperRef, listRef],
  );

  const onRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      visibleStartIndexRef.current = visibleRows.startIndex;
    },
    [],
  );

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

  const scrollRafIdRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (scrollRafIdRef.current !== null) return;

    scrollRafIdRef.current = requestAnimationFrame(() => {
      scrollRafIdRef.current = null;
      if (
        !scrollContainerRef.current ||
        !wrapperRef.current ||
        !listRef.current
      )
        return;

      const listElement = listRef.current.element;
      if (!listElement) return;

      // Batch all DOM reads first
      const currentScrollHeight = listElement.scrollHeight;
      const containerScrollTop = scrollContainerRef.current.scrollTop;
      const wrapperOffsetTop = wrapperRef.current.offsetTop;
      const currentListScrollTop = listElement.scrollTop;

      // Calculate how much the wrapper has scrolled past the top of the scroll container
      const scrollTop = Math.max(0, containerScrollTop - wrapperOffsetTop);

      // Perform state updates / DOM writes after all reads
      if (
        currentScrollHeight &&
        currentScrollHeight !== totalHeightRef.current
      ) {
        totalHeightRef.current = currentScrollHeight;
        setTotalHeight(currentScrollHeight);
      }

      // Only set if they are different to prevent redundant scroll events and loops
      if (Math.abs(currentListScrollTop - scrollTop) > 1) {
        listElement.scrollTop = scrollTop;
      }
    });
  }, [scrollContainerRef, wrapperRef, listRef, totalHeightRef]);

  // Sync scroll height and list scrollTop on container scroll events.
  useEffect(() => {
    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          setViewportHeight(scrollContainerRef.current.clientHeight);
        } else {
          setViewportHeight(window.innerHeight);
        }
        setIsMobile(window.innerWidth < 768);
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const container = scrollContainerRef.current;

    let wheelAccumulator = 0;
    let wheelRafId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (!container) return;
      e.preventDefault();
      wheelAccumulator += e.deltaY;
      if (wheelRafId === null) {
        wheelRafId = requestAnimationFrame(() => {
          wheelRafId = null;
          if (container) {
            container.scrollTop -= wheelAccumulator;
          }
          wheelAccumulator = 0;
        });
      }
    };

    let touchStartClientY = 0;
    let touchDeltaAccumulator = 0;
    let touchRafId: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartClientY = e.touches[0].clientY;
        touchDeltaAccumulator = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && container) {
        e.preventDefault();
        const currentClientY = e.touches[0].clientY;
        const deltaY = currentClientY - touchStartClientY;
        touchStartClientY = currentClientY;
        touchDeltaAccumulator += deltaY;

        if (touchRafId === null) {
          touchRafId = requestAnimationFrame(() => {
            touchRafId = null;
            if (container) {
              container.scrollTop += touchDeltaAccumulator;
            }
            touchDeltaAccumulator = 0;
          });
        }
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
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (scrollRafIdRef.current !== null) {
        cancelAnimationFrame(scrollRafIdRef.current);
        scrollRafIdRef.current = null;
      }
      if (wheelRafId !== null) {
        cancelAnimationFrame(wheelRafId);
      }
      if (touchRafId !== null) {
        cancelAnimationFrame(touchRafId);
      }
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [scrollContainerRef, handleScroll]);

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
  }, [replies, isLoading]);

  const wrapperHeight = useMemo((): string | number => {
    return totalHeight || "100vh";
  }, [totalHeight]);

  // Scroll to newest reply when a reply is added
  useEffect(() => {
    if (!isReplyAdded) return;
    if (!parentStreamId || replies.length === 0) return;

    let raf1: number | null = null;
    let raf2: number | null = null;

    const executeScroll = () => {
      const firstIndex = 0;

      // 1. Sync outer parent scroll container
      if (scrollContainerRef.current && wrapperRef.current) {
        const targetParentScrollTop = wrapperRef.current.offsetTop;
        if (typeof scrollContainerRef.current.scrollTo === "function") {
          scrollContainerRef.current.scrollTo({
            top: targetParentScrollTop,
            behavior: "smooth",
          });
        } else {
          scrollContainerRef.current.scrollTop = targetParentScrollTop;
        }
      }

      // 2. Sync virtualized list scroll position
      if (listRef.current) {
        if (
          !listRef.current.scrollToItem &&
          typeof listRef.current.scrollToRow === "function"
        ) {
          listRef.current.scrollToItem = (
            index: number,
            align: "auto" | "center" | "end" | "smart" | "start" = "auto",
          ) => {
            listRef.current.scrollToRow({
              index,
              align,
              behavior: "smooth",
            });
          };
        }

        if (typeof listRef.current.scrollToItem === "function") {
          // 'start' is used because index 0 is physically at the top (visually the bottom due to scaleY(-1))
          listRef.current.scrollToItem(firstIndex, "start");
        } else if (typeof listRef.current.scrollToRow === "function") {
          listRef.current.scrollToRow({
            index: firstIndex,
            align: "start",
            behavior: "smooth",
          });
        }

        if (listRef.current.element) {
          listRef.current.element.scrollTop = 0;
        }
      }

      dispatch(setIsReplyAdded(false));
    };

    // Double rAF ensures React-Window has committed new item layout to DOM before scrolling
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        executeScroll();
      });
    });

    return () => {
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
    };
  }, [
    isReplyAdded,
    parentStreamId,
    replies.length,
    dispatch,
    scrollContainerRef,
    wrapperRef,
    listRef,
  ]);

  // Dynamically attach scroll listener to the virtualized list element to sync scrollTop back to the parent scroll container.
  // This prevents scroll jumping issues when user manual-scrolls after programmatic auto-scrolling.
  useEffect(() => {
    if (listRef.current && listRef.current.element) {
      const listElement = listRef.current.element;
      if (!listElement._hasScrollListener) {
        listElement._hasScrollListener = true;
        let listScrollRafId: number | null = null;
        const handleListScroll = () => {
          if (listScrollRafId !== null) return;
          listScrollRafId = requestAnimationFrame(() => {
            listScrollRafId = null;
            if (!scrollContainerRef.current || !wrapperRef.current) return;
            // Batch all reads first
            const listScrollTop = listElement.scrollTop;
            const wrapperOffsetTop = wrapperRef.current.offsetTop;
            const containerScrollTop = scrollContainerRef.current.scrollTop;

            const targetParentScrollTop = listScrollTop + wrapperOffsetTop;
            if (Math.abs(containerScrollTop - targetParentScrollTop) > 1) {
              scrollContainerRef.current.scrollTop = targetParentScrollTop;
            }
          });
        };
        listElement.addEventListener("scroll", handleListScroll);
        listElement._cleanupScrollListener = () => {
          if (listScrollRafId !== null) {
            cancelAnimationFrame(listScrollRafId);
            listScrollRafId = null;
          }
          listElement.removeEventListener("scroll", handleListScroll);
          delete listElement._hasScrollListener;
          delete listElement._cleanupScrollListener;
        };
      }
    }
  }, [isReplyAdded]);

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
    onResize,
    onRowsRendered,
    isReady,
  };
}
