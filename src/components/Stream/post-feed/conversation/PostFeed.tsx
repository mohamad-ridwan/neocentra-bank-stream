import React from "react";
import { X } from "lucide-react";
import PostHeader from "../PostHeader";
import PostContent from "../PostContent";
import PostActionBar from "../PostActionBar";
import { useStream } from "../../hooks/useStream";

interface PostFeedProps {
  handleCommentClick: () => void;
}

const PostFeed = React.memo(function PostFeed({
  handleCommentClick,
}: Readonly<PostFeedProps>) {
  console.log("POST FEED RENDERED");
  const {
    activeParent: parent,
    hasLiked,
    handleLike,
    handleShare,
    handleCloseConversation,
  } = useStream();

  return (
    <div
      className="hidden md:flex flex-col justify-center items-start p-12 md:pl-32 flex-1 h-full relative"
      onClick={handleCloseConversation}
    >
      {/* Close Button positioned at the top-right of the left panel */}
      <div
        className="absolute top-6 right-6 z-20"
        onClick={(e) => e.stopPropagation()}
      >
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
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <PostHeader post={parent} size="lg" />

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
