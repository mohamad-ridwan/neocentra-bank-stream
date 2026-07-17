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
