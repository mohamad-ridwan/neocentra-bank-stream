import React from "react";
import dynamic from "next/dynamic";
import ConversationModalContent from "./conversation/ConversationModalContent";

const RemoteDialog = dynamic(
  () => import("shared_remote/Dialog").then((m) => m.Dialog),
  { ssr: false }
);

const RemoteDialogContent = dynamic(
  () => import("shared_remote/Dialog").then((m) => m.DialogContent),
  { ssr: false }
);

interface CommentsSectionProps {
  streamId: number;
  commentsCount: number;
  activeConversation: any;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CommentsSection({
  streamId,
  commentsCount,
  activeConversation,
  commentText,
  onCommentTextChange,
  onAddComment,
  onClose,
}: CommentsSectionProps) {
  // The dialog is open if this section's stream ID matches the active conversation's parent ID
  const isOpen = !!(activeConversation && activeConversation.parent?.stream_id === streamId);

  return (
    <RemoteDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <RemoteDialogContent className="max-w-4xl w-[95vw] md:w-full bg-slate-950 border border-slate-800 text-white p-0 overflow-hidden h-[85vh] max-h-[600px] flex flex-col md:flex-row rounded-2xl">
        {isOpen && (
          <ConversationModalContent
            parent={activeConversation.parent}
            replies={activeConversation.replies}
            commentText={commentText}
            onCommentTextChange={onCommentTextChange}
            onAddComment={onAddComment}
            onClose={onClose}
          />
        )}
      </RemoteDialogContent>
    </RemoteDialog>
  );
}
