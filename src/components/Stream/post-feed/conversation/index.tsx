import React, { memo } from "react";
import PostFeed from "./PostFeed";
import Conversation from "./Conversation";
import { useStream } from "../../hooks/useStream";

interface ConversationModalContentProps {}

const ConversationModalContent = memo(
  ({}: Readonly<ConversationModalContentProps>) => {
    const { inputRef, handleCommentClick } = useStream();
    return (
      <div className="flex flex-col md:flex-row h-full w-full bg-transparent text-slate-100 overflow-hidden">
        <PostFeed handleCommentClick={handleCommentClick} />
        <Conversation
          inputRef={inputRef}
          handleCommentClick={handleCommentClick}
        />
      </div>
    );
  },
);

export default ConversationModalContent;
