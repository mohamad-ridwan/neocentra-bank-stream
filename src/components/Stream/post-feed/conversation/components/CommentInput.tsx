import React from "react";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";

const RemoteButton = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  { ssr: false },
);

interface CommentInputProps {
  onAddComment: (text: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const CommentInput = React.memo(
  function CommentInput({
    onAddComment,
    inputRef,
  }: Readonly<CommentInputProps>) {
    const [commentText, setCommentText] = React.useState("");

    console.log("input rendered");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (commentText.trim()) {
        onAddComment(commentText);
        setCommentText("");
      }
    };

    return (
      <div className="p-4 bg-slate-950 border-t border-slate-800/80 w-full relative z-10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
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
  },
  (prev, next) => {
    return prev.inputRef?.current === next.inputRef?.current;
  },
);
