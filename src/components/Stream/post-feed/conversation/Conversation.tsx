import React from "react";
import { X } from "lucide-react";
import { ConversationReplies } from "./components/ConversationReplies";
import { CommentInput } from "./components/CommentInput";
import { useStream } from "../../hooks/useStream";

interface ConversationProps {
  inputRef: React.RefObject<HTMLInputElement>;
  handleCommentClick: () => void;
}

const Conversation = React.memo(
  function Conversation({
    inputRef,
    handleCommentClick,
  }: Readonly<ConversationProps>) {
    const { handleAddComment, handleCloseConversation } = useStream();
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    return (
      <div className="w-full md:max-w-md lg:max-w-lg h-full bg-slate-950 border-l border-slate-800/60 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Close Button for mobile screens only */}
        <div className="absolute top-4 right-4 z-20 md:hidden">
          <button
            onClick={handleCloseConversation}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable conversation wrapper */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 space-y-6 custom-scrollbar relative"
          style={{ overflowAnchor: "none", transform: "scaleY(-1)" }}
        >
          {/* List replies (incorporating parent post virtualized) */}
          <ConversationReplies
            onCommentToggle={handleCommentClick}
            scrollContainerRef={scrollContainerRef}
          />
        </div>

        {/* Sticky bottom content: comment input box */}
        <CommentInput onAddComment={handleAddComment} inputRef={inputRef} />
      </div>
    );
  },
  (prev, next) => {
    return prev.inputRef?.current === next.inputRef?.current;
  },
);

export default Conversation;
