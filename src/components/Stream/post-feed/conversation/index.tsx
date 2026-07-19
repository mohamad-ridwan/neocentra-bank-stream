import React from "react";
import { StreamPost, ReplyPost } from "@/types/stream.types";
import PostFeed from "./PostFeed";
import Conversation from "./Conversation";

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
}: Readonly<ConversationModalContentProps>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCommentClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-transparent text-slate-100 overflow-hidden">
      <PostFeed
        parent={parent}
        onClose={onClose}
        hasLiked={hasLiked}
        onLike={onLike}
        onShare={onShare}
        onCommentClick={handleCommentClick}
      />
      <Conversation
        parent={parent}
        replies={replies}
        commentText={commentText}
        onCommentTextChange={onCommentTextChange}
        onAddComment={onAddComment}
        onClose={onClose}
        hasLiked={hasLiked}
        onLike={onLike}
        onShare={onShare}
        inputRef={inputRef}
      />
    </div>
  );
}
