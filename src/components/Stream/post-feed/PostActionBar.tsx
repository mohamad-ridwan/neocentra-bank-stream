import React from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { StreamPost } from "@/types/stream.types";

interface PostActionBarProps {
  post: StreamPost;
  hasLiked: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare: () => void;
  forceHoverLike?: boolean;
  forceHoverComment?: boolean;
}

export default function PostActionBar({
  post,
  hasLiked,
  onLike,
  onCommentToggle,
  onShare,
  forceHoverLike,
  forceHoverComment,
}: PostActionBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 text-slate-400">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button
          onClick={onLike}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors duration-200 group ${
            hasLiked || forceHoverLike ? "text-rose-500" : "hover:text-rose-500"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-125 ${
              hasLiked ? "fill-rose-500 stroke-rose-500" : ""
            } ${forceHoverLike && !hasLiked ? "scale-125 stroke-rose-500" : ""}`}
          />
          <span>{post.total_likes}</span>
        </button>

        {/* Comment Toggle Button */}
        <button
          onClick={onCommentToggle}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors duration-200 group ${
            forceHoverComment ? "text-teal-400" : "hover:text-teal-400"
          }`}
        >
          <MessageSquare
            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-125 ${
              forceHoverComment ? "scale-125" : ""
            }`}
          />
          <span>{post.total_replies}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 text-xs font-semibold hover:text-indigo-400 transition-colors duration-200 group"
        >
          <Share2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
          <span>{post.shares ?? 0}</span>
        </button>
      </div>

      <button className="text-slate-500 hover:text-slate-300 transition-colors">
        <Bookmark className="w-4 h-4" />
      </button>
    </div>
  );
}
