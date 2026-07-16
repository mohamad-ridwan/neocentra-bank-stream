import React from "react";
import { StreamPost, ReplyPost } from "@/types/stream.types";
import { Send, X, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import PostActionBar from "../PostActionBar";

const RemoteButton = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  { ssr: false },
);

interface ConversationModalContentProps {
  parent: StreamPost | null;
  replies: ReplyPost[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  onClose: () => void;
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
}

export default function ConversationModalContent({
  parent,
  replies,
  commentText,
  onCommentTextChange,
  onAddComment,
  onClose,
  hasLiked,
  onLike,
  onShare,
}: ConversationModalContentProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCommentClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-transparent text-slate-100 overflow-hidden">
      {/* LEFT SIDE: Centered Parent Post Detail (Visible on md and up, aligned left-center of viewport) */}
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-md">
                  {parent.user.fullname.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-base hover:underline cursor-pointer">
                      {parent.user.fullname}
                    </span>
                    {parent.user.isVerified && (
                      <CheckCircle className="w-5 h-5 text-teal-400 fill-teal-400/20" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {parent.user.role || "NeoCentra user"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {parent.created_display}
              </span>
            </div>

            {/* Content */}
            <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap break-words">
              {parent.content_original}
            </p>

            {/* Action Bar */}
            <PostActionBar
              post={parent}
              hasLiked={hasLiked}
              onLike={onLike}
              onCommentToggle={handleCommentClick}
              onShare={onShare}
            />
          </div>
        ) : (
          <div className="text-slate-500 text-sm animate-pulse">
            Loading post detail...
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Conversation content on far right corner, height matching viewport */}
      <div className="w-full md:max-w-md lg:max-w-lg h-full bg-slate-950 border-l border-slate-800/60 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Close Button for mobile screens only */}
        <div className="absolute top-4 right-4 z-20 md:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable conversation wrapper */}
        <div className="flex-1 overflow-y-auto p-6 pt-16 pb-24 space-y-6 custom-scrollbar">
          {/* Top content: parent post detail */}
          {parent && (
            <div className="pb-6 border-b border-slate-800/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-slate-950 text-xs font-bold shadow-sm">
                  {parent.user.fullname.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white text-xs">
                      {parent.user.fullname}
                    </span>
                    {parent.user.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {parent.user.role || "NeoCentra user"}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 ml-auto">
                  {parent.created_display}
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap break-words pl-11">
                {parent.content_original}
              </p>
              <div className="pl-11 mt-4">
                <PostActionBar
                  post={parent}
                  hasLiked={hasLiked}
                  onLike={onLike}
                  onCommentToggle={handleCommentClick}
                  onShare={onShare}
                />
              </div>
            </div>
          )}

          {/* List replies */}
          <div className="space-y-4 pb-16">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Replies ({replies.length})
            </h4>

            {replies.length > 0 ? (
              <div className="space-y-3">
                {replies.map((reply) => (
                  <div
                    key={reply.stream_id}
                    className="bg-slate-900/30 border border-slate-800/40 hover:border-slate-800/80 rounded-2xl p-4 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
                          {reply.user.fullname.charAt(0)}
                        </div>
                        <span className="font-bold text-teal-400 text-xs">
                          {reply.user.fullname}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500">
                        {reply.created_display}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed pl-8 whitespace-pre-wrap break-words">
                      {reply.content_original}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
                No replies yet. Be the first to start the conversation!
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom content: comment input box */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-800/80">
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
      </div>
    </div>
  );
}
