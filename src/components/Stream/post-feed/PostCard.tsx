import React from "react";
import { StreamPost } from "@/types/stream.types";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActionBar from "./PostActionBar";
import CommentsSection from "./CommentsSection";

interface PostCardProps {
  post: StreamPost;
  activeConversation: any;
  showComments: boolean;
  commentText: string;
  onLike: () => void;
  onShare: () => void;
  onCommentToggle: () => void;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
}

export default function PostCard({
  post,
  activeConversation,
  showComments,
  commentText,
  onLike,
  onShare,
  onCommentToggle,
  onCommentTextChange,
  onAddComment,
}: PostCardProps) {
  const hasLiked = !!post.reaction.my_reaction;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
      <PostHeader post={post} />
      <PostContent content={post.content_original} />
      <PostActionBar
        post={post}
        hasLiked={hasLiked}
        onLike={onLike}
        onCommentToggle={onCommentToggle}
        onShare={onShare}
      />
      {showComments && (
        <CommentsSection
          streamId={post.stream_id}
          commentsCount={post.total_replies}
          activeConversation={activeConversation}
          commentText={commentText}
          onCommentTextChange={onCommentTextChange}
          onAddComment={onAddComment}
          onClose={onCommentToggle}
        />
      )}
    </div>
  );
}
