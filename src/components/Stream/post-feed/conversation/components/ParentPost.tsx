import React, { useMemo } from "react";
import { StreamPost, ReactionDetails, StreamUser } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";
import { useStream } from "../../../hooks/useStream";
import ImageContent from "../../ImageContent";

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

  const postHeaderData = useMemo((): StreamUser & {
    created_display?: string;
    stream_id?: number;
  } => {
    return {
      user_id: parent?.user?.user_id as number,
      fullname: parent?.user?.fullname as string,
      avatar: parent?.user?.avatar as string,
      username: parent?.user?.username as string,
      role: parent?.user?.role as string,
      isVerified: parent?.user?.isVerified as boolean,
      created_display: parent?.created_display,
      stream_id: parent?.stream_id,
    };
  }, [
    parent?.user?.user_id,
    parent?.user?.fullname,
    parent?.user?.avatar,
    parent?.user?.username,
    parent?.user?.role,
    parent?.user?.isVerified,
    parent?.created_display,
    parent?.stream_id,
  ]);

  if (!parent) return null;

  return (
    <div className="pb-6 border-b border-slate-800/60">
      <PostHeader post={postHeaderData} size="sm" />
      <PostContent
        content={parent.content_original}
        size="sm"
        className="pl-11"
      />
      {parent?.images && parent.images.length > 0 && (
        <ImageContent
          images={parent.images}
          streamId={parent.stream_id}
          size="sm"
          wrapperClassName="w-full flex pl-11"
        />
      )}
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
