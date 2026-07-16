import React, { useMemo } from "react";
import { List, useDynamicRowHeight } from "react-window";
import { StreamPost } from "@/types/stream.types";
import PostCard from "./PostCard";

interface PostsFeedProps {
  posts: StreamPost[];
  activeConversation: any;
  showComments: Record<number, boolean>;
  newCommentTexts: Record<number, string>;
  handleLike: (streamId: number) => void;
  handleShare: (streamId: number) => void;
  toggleComments: (streamId: number) => void;
  handleCommentTextChange: (streamId: number, text: string) => void;
  handleAddComment: (streamId: number, e: React.FormEvent) => void;
}

interface RowProps {
  posts: StreamPost[];
  activeConversation: any;
  showComments: Record<number, boolean>;
  newCommentTexts: Record<number, string>;
  handleLike: (streamId: number) => void;
  handleShare: (streamId: number) => void;
  toggleComments: (streamId: number) => void;
  handleCommentTextChange: (streamId: number, text: string) => void;
  handleAddComment: (streamId: number, e: React.FormEvent) => void;
}

const Row = React.memo(
  ({
    index,
    style,
    posts,
    activeConversation,
    showComments,
    newCommentTexts,
    handleLike,
    handleShare,
    toggleComments,
    handleCommentTextChange,
    handleAddComment,
  }: {
    index: number;
    style: React.CSSProperties;
  } & RowProps) => {
    const post = posts[index];
    if (!post) return null;

    return (
      <div style={style} className="pb-3">
        <PostCard
          post={post}
          activeConversation={activeConversation}
          showComments={!!showComments[post.stream_id]}
          commentText={newCommentTexts[post.stream_id] || ""}
          onLike={() => handleLike(post.stream_id)}
          onShare={() => handleShare(post.stream_id)}
          onCommentToggle={() => toggleComments(post.stream_id)}
          onCommentTextChange={(text) =>
            handleCommentTextChange(post.stream_id, text)
          }
          onAddComment={(e) => handleAddComment(post.stream_id, e)}
        />
      </div>
    );
  },
);

Row.displayName = "PostFeedRow";

export default function PostsFeed({
  posts,
  activeConversation,
  showComments,
  newCommentTexts,
  handleLike,
  handleShare,
  toggleComments,
  handleCommentTextChange,
  handleAddComment,
}: PostsFeedProps) {
  const [viewportHeight, setViewportHeight] = React.useState(800);
  const [totalHeight, setTotalHeight] = React.useState<number | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<any>(null);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 150,
  });

  // Dynamically set viewport height and listen to window scroll to sync scrollTop
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: wrapperHeight, width: "100%" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: viewportHeight,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <List
          listRef={listRef}
          rowCount={posts.length}
          rowHeight={rowHeight}
          rowComponent={Row as any}
          rowProps={{
            posts,
            activeConversation,
            showComments,
            newCommentTexts,
            handleLike,
            handleShare,
            toggleComments,
            handleCommentTextChange,
            handleAddComment,
          }}
          className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
          style={{ height: "100%", width: "100%", overflow: "hidden" }}
          overscanCount={5}
        />
      </div>
    </div>
  );
}
