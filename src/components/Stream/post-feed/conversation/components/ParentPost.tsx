import React from "react";
import { StreamPost, ReactionDetails } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";
import { useStream } from "../../../hooks/useStream";

interface ParentPostProps {
  parent: StreamPost | null;
  onCommentClick?: () => void;
}

export const ParentPost = React.memo(function ParentPost({
  parent,
  onCommentClick,
}: Readonly<ParentPostProps>) {
  const { hasLiked, handleLike, handleShare, handleCommentClick } = useStream(
    parent?.stream_id,
    parent?.reaction?.my_reaction as ReactionDetails,
  );

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
          onLike={handleLike as any}
          onCommentToggle={onCommentClick || handleCommentClick}
          onShare={handleShare as any}
        />
      </div>
    </div>
  );
});
