import React from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { StreamPost, ReplyPost } from "@/types/stream.types";

interface PostActionBarProps {
  post: StreamPost | ReplyPost;
  hasLiked: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare: () => void;
  forceHoverLike?: boolean;
  forceHoverComment?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function PostActionBar({
  post,
  hasLiked,
  onLike,
  onCommentToggle,
  onShare,
  forceHoverLike,
  forceHoverComment,
  size = "md",
}: Readonly<PostActionBarProps>) {
  const isXs = size === "xs";

  const containerClasses = isXs
    ? "flex items-center justify-between pt-2 text-slate-500"
    : "flex items-center justify-between border-t border-slate-800/60 pt-4 text-slate-400";

  const buttonGap = isXs ? "gap-4" : "gap-6";
  const btnClasses = isXs
    ? "flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 group"
    : "flex items-center gap-2 text-xs font-semibold transition-colors duration-200 group";

  const iconSize = isXs ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={containerClasses}>
      <div className={`flex items-center ${buttonGap}`}>
        {/* Like Button */}
        <button
          onClick={onLike}
          className={`${btnClasses} ${
            hasLiked || forceHoverLike ? "text-rose-500" : "hover:text-rose-500"
          }`}
        >
          <Heart
            className={`${iconSize} transition-transform duration-200 group-hover:scale-125 ${
              hasLiked ? "fill-rose-500 stroke-rose-500" : ""
            } ${forceHoverLike && !hasLiked ? "scale-125 stroke-rose-500" : ""}`}
          />
          <span>{post.total_likes}</span>
        </button>

        {/* Comment Toggle Button */}
        <button
          onClick={onCommentToggle}
          className={`${btnClasses} ${
            forceHoverComment ? "text-teal-400" : "hover:text-teal-400"
          }`}
        >
          <MessageSquare
            className={`${iconSize} transition-transform duration-200 group-hover:scale-125 ${
              forceHoverComment ? "scale-125" : ""
            }`}
          />
          <span>{post.total_replies}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className={`${btnClasses} hover:text-indigo-400 transition-colors duration-200 group`}
        >
          <Share2
            className={`${iconSize} transition-transform duration-200 group-hover:scale-125`}
          />
          <span>{"shares" in post ? (post.shares ?? 0) : 0}</span>
        </button>
      </div>

      <button
        className={`${isXs ? "text-slate-600" : "text-slate-500"} hover:text-slate-300 transition-colors`}
      >
        <Bookmark className={iconSize} />
      </button>
    </div>
  );
}
