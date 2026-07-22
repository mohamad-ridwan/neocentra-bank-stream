import React from "react";
import PostFeed from "./PostFeed";
import Conversation from "./Conversation";
import { useStream } from "../../hooks/useStream";

interface ConversationModalContentProps {
  onClose: () => void;
}

export default function ConversationModalContent({
  onClose,
}: Readonly<ConversationModalContentProps>) {
  const { handleAddComment, inputRef } = useStream();

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-transparent text-slate-100 overflow-hidden">
      <PostFeed onClose={onClose} />
      <Conversation
        onAddComment={handleAddComment as any}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
}
