import React from "react";
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
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.stream_id}
          post={post}
          activeConversation={activeConversation}
          showComments={!!showComments[post.stream_id]}
          commentText={newCommentTexts[post.stream_id] || ""}
          onLike={() => handleLike(post.stream_id)}
          onShare={() => handleShare(post.stream_id)}
          onCommentToggle={() => toggleComments(post.stream_id)}
          onCommentTextChange={(text) => handleCommentTextChange(post.stream_id, text)}
          onAddComment={(e) => handleAddComment(post.stream_id, e)}
        />
      ))}
    </div>
  );
}
