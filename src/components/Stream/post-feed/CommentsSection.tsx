import React from "react";
import { Send } from "lucide-react";
import dynamic from "next/dynamic";

const RemoteButton = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  {
    ssr: false,
    loading: () => (
      <button className="bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
        Loading Button...
      </button>
    ),
  },
);

interface CommentsSectionProps {
  streamId: number;
  commentsCount: number;
  activeConversation: any;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
}

export default function CommentsSection({
  streamId,
  commentsCount,
  activeConversation,
  commentText,
  onCommentTextChange,
  onAddComment,
}: CommentsSectionProps) {
  return (
    <div className="mt-6 border-t border-slate-800/60 pt-6 space-y-4 animate-fadeIn">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Comments ({commentsCount})
      </h3>

      {/* Comment List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {activeConversation &&
          activeConversation.parent?.stream_id === streamId &&
          activeConversation.replies.map((comment: any) => (
            <div
              key={comment.stream_id}
              className="bg-slate-950/60 border border-slate-800/40 rounded-xl p-3 text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-teal-400">
                  {comment.user.fullname}
                </span>
                <span className="text-[10px] text-slate-500">
                  {comment.created_display}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {comment.content_original}
              </p>
            </div>
          ))}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={onAddComment} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        <RemoteButton
          type="submit"
          className="px-3 py-2 rounded-xl flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </RemoteButton>
      </form>
    </div>
  );
}
