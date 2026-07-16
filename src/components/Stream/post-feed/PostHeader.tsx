import React from "react";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { StreamPost } from "@/types/stream.types";

interface PostHeaderProps {
  post: StreamPost;
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
          {post.user.fullname.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white text-sm hover:underline cursor-pointer">
              {post.user.fullname}
            </span>
            {post.user.isVerified && (
              <CheckCircle className="w-4 h-4 text-teal-400 fill-teal-400/20" />
            )}
          </div>
          <p className="text-xs text-slate-400">
            {post.user.role || "NeoCentra user"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">
          {post.created_display}
        </span>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
