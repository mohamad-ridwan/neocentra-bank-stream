import React from "react";
import { StreamPost } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";

interface ParentPostProps {
  parent: StreamPost | null;
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentClick: () => void;
}

export const ParentPost = React.memo(function ParentPost({
  parent,
  hasLiked,
  onLike,
  onShare,
  onCommentClick,
}: Readonly<ParentPostProps>) {
  if (!parent) return null;

  return (
    <div className="pb-6 border-b border-slate-800/60">
      <PostHeader post={parent} size="sm" hideMenu={true} />
      <PostContent
        content={parent.content_original}
        size="sm"
        className="pl-11"
      />
      <div className="pl-11 mt-4">
        <PostActionBar
          post={parent}
          hasLiked={hasLiked}
          onLike={onLike}
          onCommentToggle={onCommentClick}
          onShare={onShare}
        />
      </div>
    </div>
  );
});
