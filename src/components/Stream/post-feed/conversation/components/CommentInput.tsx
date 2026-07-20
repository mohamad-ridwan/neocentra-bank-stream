import React from "react";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";

const RemoteButton = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  { ssr: false },
);

interface CommentInputProps {
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const CommentInput = React.memo(function CommentInput({
  commentText,
  onCommentTextChange,
  onAddComment,
  inputRef,
}: Readonly<CommentInputProps>) {
  return (
    <div className="p-4 bg-slate-950 border-t border-slate-800/80 w-full relative z-10">
      <form onSubmit={onAddComment} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
        />
        <RemoteButton
          type="submit"
          className="px-3.5 py-2.5 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-95"
        >
          <Send className="w-4 h-4" />
        </RemoteButton>
      </form>
    </div>
  );
});
