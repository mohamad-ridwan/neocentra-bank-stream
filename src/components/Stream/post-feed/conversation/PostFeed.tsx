import React from "react";
import { StreamPost } from "@/types/stream.types";
import { X } from "lucide-react";
import PostHeader from "../PostHeader";
import PostContent from "../PostContent";
import PostActionBar from "../PostActionBar";

interface PostFeedProps {
  parent: StreamPost | null;
  onClose: () => void;
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentClick: () => void;
}

export default function PostFeed({
  parent,
  onClose,
  hasLiked,
  onLike,
  onShare,
  onCommentClick,
}: Readonly<PostFeedProps>) {
  return (
    <div
      className="hidden md:flex flex-col justify-center items-start p-12 md:pl-32 flex-1 h-full relative"
      onClick={onClose}
    >
      {/* Close Button positioned at the top-right of the left panel */}
      <div
        className="absolute top-6 right-6 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
          <PostHeader post={parent} size="lg" hideMenu={true} />

          {/* Content */}
          <PostContent content={parent.content_original} size="lg" />

          {/* Action Bar */}
          <PostActionBar
            post={parent}
            hasLiked={hasLiked}
            onLike={onLike}
            onCommentToggle={onCommentClick}
            onShare={onShare}
          />
        </div>
      ) : (
        <div className="text-slate-500 text-sm animate-pulse">
          Loading post detail...
        </div>
      )}
    </div>
  );
}
