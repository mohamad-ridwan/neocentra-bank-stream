import React, { useMemo } from "react";
import { StreamPost } from "@/types/stream.types";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActionBar from "./PostActionBar";
import CommentsSection from "./CommentsSection";

interface PostCardProps {
  post: StreamPost;
  activeConversation: any;
  showComments: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentToggle: () => void;
  onAddComment: (text: string) => void;
  forceOpenTooltip?: boolean;
  forceOpenMenu?: boolean;
  forceHoverLike?: boolean;
  forceHoverComment?: boolean;
  forceCopyLinkHover?: boolean;
  demoLink?: string;
}

export default function PostCard({
  post,
  activeConversation,
  showComments,
  onLike,
  onShare,
  onCommentToggle,
  onAddComment,
  forceOpenTooltip,
  forceOpenMenu,
  forceHoverLike,
  forceHoverComment,
  forceCopyLinkHover,
  demoLink,
}: Readonly<PostCardProps>) {
  const hasLiked = useMemo(() => {
    return !!post.reaction.my_reaction;
  }, [post?.reaction?.my_reaction]);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
      <PostHeader
        post={post}
        forceOpenTooltip={forceOpenTooltip}
        forceOpenMenu={forceOpenMenu}
        forceCopyLinkHover={forceCopyLinkHover}
        demoLink={demoLink}
      />
      <PostContent content={post.content_original} />
      <PostActionBar
        post={post}
        hasLiked={hasLiked}
        onLike={onLike}
        onCommentToggle={onCommentToggle}
        onShare={onShare}
        forceHoverLike={forceHoverLike}
        forceHoverComment={forceHoverComment}
      />
      {showComments && (
        <CommentsSection
          streamId={post.stream_id}
          commentsCount={post.total_replies}
          activeConversation={activeConversation}
          onClose={onCommentToggle}
        />
      )}
    </div>
  );
}
