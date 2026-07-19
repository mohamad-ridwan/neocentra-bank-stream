import React from "react";
import { StreamPost, ReplyPost } from "@/types/stream.types";
import { Send, X } from "lucide-react";
import dynamic from "next/dynamic";
import PostHeader from "../PostHeader";
import PostContent from "../PostContent";
import PostActionBar from "../PostActionBar";

const RemoteButton = dynamic(
  () => import("shared_remote/Button").then((m) => m.Button),
  { ssr: false },
);

interface ConversationProps {
  parent: StreamPost | null;
  replies: ReplyPost[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  onClose: () => void;
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function Conversation({
  parent,
  replies,
  commentText,
  onCommentTextChange,
  onAddComment,
  onClose,
  hasLiked,
  onLike,
  onShare,
  inputRef,
}: Readonly<ConversationProps>) {
  const localInputRef = React.useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef || localInputRef;

  const handleCommentClick = () => {
    if (resolvedInputRef.current) {
      resolvedInputRef.current.focus();
    }
  };

  return (
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
            <PostHeader post={parent} size="sm" hideMenu={true} />
            <PostContent
              content={parent.content_original}
              size="sm"
              className="pl-11"
            />
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
              {replies.map((reply) => {
                const hasReplyLiked = !!reply.reaction.my_reaction;
                return (
                  <div
                    key={reply.stream_id}
                    className="bg-slate-900/30 border border-slate-800/40 hover:border-slate-800/80 rounded-2xl p-4 transition-all duration-200"
                  >
                    <PostHeader post={reply} size="xs" hideMenu={true} />
                    <PostContent
                      content={reply.content_original}
                      size="xs"
                      className="pl-8"
                    />
                    <div className="pl-8 mt-2">
                      <PostActionBar
                        post={reply}
                        hasLiked={hasReplyLiked}
                        onLike={() => {
                          console.log("Like reply:", reply.stream_id);
                        }}
                        onCommentToggle={handleCommentClick}
                        onShare={() => {
                          console.log("Share reply:", reply.stream_id);
                        }}
                        size="xs"
                      />
                    </div>
                  </div>
                );
              })}
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
            ref={resolvedInputRef}
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
  );
}
