import React from "react";
import { StreamPost, ReplyPost, ReactionDetails } from "@/types/stream.types";
import PostFeed from "./PostFeed";
import Conversation from "./Conversation";
import { useStream } from "../../hooks/useStream";

interface ConversationModalContentProps {
  parent: StreamPost | null;
  replies: ReplyPost[];
  onClose: () => void;
}

export default function ConversationModalContent({
  parent,
  replies,
  onClose,
}: Readonly<ConversationModalContentProps>) {
  const { handleAddComment, inputRef } = useStream(
    parent?.stream_id,
    parent?.reaction?.my_reaction as ReactionDetails,
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-transparent text-slate-100 overflow-hidden">
      <PostFeed parent={parent} onClose={onClose} />
      <Conversation
        parent={parent}
        replies={replies}
        onAddComment={handleAddComment as any}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
}
