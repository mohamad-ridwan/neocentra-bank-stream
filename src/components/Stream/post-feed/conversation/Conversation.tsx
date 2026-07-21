import React from "react";
import { useSelector } from "react-redux";
import { StreamPost, ReplyPost } from "@/types/stream.types";
import { X } from "lucide-react";
import { selectConversationPagination } from "@/store/selectors/streamSelectors";
import { ConversationReplies } from "./components/ConversationReplies";
import { CommentInput } from "./components/CommentInput";

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

const Conversation = React.memo(function Conversation({
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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const pagination = useSelector(selectConversationPagination);
  const isLastPage = pagination?.is_last_page ?? false;

  const handleCommentClick = React.useCallback(() => {
    if (resolvedInputRef.current) {
      resolvedInputRef.current.focus();
    }
  }, [resolvedInputRef]);

  const parentStreamId = parent?.stream_id ?? 0;

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
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 space-y-6 custom-scrollbar relative"
        style={{ overflowAnchor: "none", transform: "scaleY(-1)" }}
      >
        {/* List replies (incorporating parent post virtualized) */}
        <ConversationReplies
          parent={parent}
          hasLiked={hasLiked}
          onLike={onLike}
          onShare={onShare}
          parentStreamId={parentStreamId}
          replies={replies}
          onCommentToggle={handleCommentClick}
          isLastPage={isLastPage}
          scrollContainerRef={scrollContainerRef}
        />
      </div>

      {/* Sticky bottom content: comment input box */}
      <CommentInput
        commentText={commentText}
        onCommentTextChange={onCommentTextChange}
        onAddComment={onAddComment}
        inputRef={resolvedInputRef}
      />
    </div>
  );
});

export default Conversation;
