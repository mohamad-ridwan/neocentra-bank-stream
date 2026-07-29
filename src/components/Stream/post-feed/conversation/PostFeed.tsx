import React, { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import PostHeader from "../PostHeader";
import PostContent from "../PostContent";
import PostActionBar from "../PostActionBar";
import { useStream } from "../../hooks/useStream";
import { StreamUser } from "@/types/stream.types";

interface PostFeedProps {
  handleCommentClick: () => void;
}

const PostFeed = React.memo(function PostFeed({
  handleCommentClick,
}: Readonly<PostFeedProps>) {
  const {
    activeParent: parent,
    hasLiked,
    handleLike,
    handleShare,
    handleCloseConversation,
  } = useStream();

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
      created_display: parent?.created_display as string,
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

  const stopPropagation = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    [],
  );

  return (
    <div
      className="hidden md:!flex flex-col justify-center items-start p-12 md:pl-32 flex-1 h-full relative"
      onClick={handleCloseConversation}
    >
      {/* Close Button positioned at the top-right of the left panel */}
      <div className="absolute top-6 right-6 z-20" onClick={stopPropagation}>
        <button
          onClick={handleCloseConversation}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {parent ? (
        <div
          className="w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-5 backdrop-blur-md cursor-default"
          onClick={stopPropagation}
        >
          {/* Header */}
          <PostHeader post={postHeaderData} size="lg" />

          {/* Content */}
          <PostContent content={parent.content_original} size="lg" />

          {/* Action Bar */}
          <PostActionBar
            post={parent}
            hasLiked={hasLiked}
            onLike={handleLike as any}
            onCommentToggle={handleCommentClick}
            onShare={handleShare as any}
          />
        </div>
      ) : (
        <div className="text-slate-500 text-sm animate-pulse">
          Loading post detail...
        </div>
      )}
    </div>
  );
});

export default PostFeed;
