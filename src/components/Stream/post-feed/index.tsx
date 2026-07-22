import React from "react";
import { List } from "react-window";
import { usePostFeed } from "../hooks/usePostFeed";
import { StreamPost } from "@/types/stream.types";
import PostCard from "./PostCard";
import PostSkeleton from "./loaders/PostSkeleton";

interface PostsFeedProps {
  posts: StreamPost[];
  activeConversation: any;
  showComments: Record<number, boolean>;
  handleLike: (streamId: number) => void;
  handleShare: (streamId: number) => void;
  toggleComments: (streamId: number) => void;
  handleAddComment: (streamId: number, text: string) => void;
}

interface RowProps {
  posts: StreamPost[];
  activeConversation: any;
  showComments: Record<number, boolean>;
  handleLike: (streamId: number) => void;
  handleShare: (streamId: number) => void;
  toggleComments: (streamId: number) => void;
  handleAddComment: (streamId: number, text: string) => void;
}

const Row = React.memo(
  ({
    index,
    style,
    posts,
    activeConversation,
    showComments,
    handleLike,
    handleShare,
    toggleComments,
    handleAddComment,
  }: {
    index: number;
    style: React.CSSProperties;
  } & RowProps) => {
    const post = posts[index];
    if (!post) {
      return (
        <div style={style} className="pb-3">
          <PostSkeleton />
        </div>
      );
    }

    return (
      <div style={style} className="pb-3">
        <PostCard
          post={post}
          activeConversation={activeConversation}
          showComments={!!showComments[post.stream_id]}
          onLike={() => handleLike(post.stream_id)}
          onShare={() => handleShare(post.stream_id)}
          onCommentToggle={() => toggleComments(post.stream_id)}
          onAddComment={(text) => handleAddComment(post.stream_id, text)}
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
  handleLike,
  handleShare,
  toggleComments,
  handleAddComment,
}: Readonly<PostsFeedProps>) {
  const {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
    onRowsRendered,
    isLoading,
  } = usePostFeed({ posts });

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
          rowCount={isLoading ? posts.length + 2 : posts.length}
          rowHeight={rowHeight}
          rowComponent={Row as any}
          onRowsRendered={onRowsRendered}
          rowProps={{
            posts,
            activeConversation,
            showComments,
            handleLike,
            handleShare,
            toggleComments,
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
