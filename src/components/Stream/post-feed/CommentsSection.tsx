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
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
}

export default function CommentsSection({
  streamId,
  commentsCount,
  activeConversation,
  commentText,
  onCommentTextChange,
  onAddComment,
  onClose,
  hasLiked,
  onLike,
  onShare,
}: CommentsSectionProps) {
  // The dialog is open if this section's stream ID matches the active conversation's parent ID
  const isOpen = !!(activeConversation && activeConversation.parent?.stream_id === streamId);

  return (
    <RemoteDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <RemoteDialogContent className="fixed inset-0 left-0 top-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none bg-transparent border-none shadow-none p-0 rounded-none flex flex-col md:flex-row">
        {isOpen && (
          <ConversationModalContent
            parent={activeConversation.parent}
            replies={activeConversation.replies}
            commentText={commentText}
            onCommentTextChange={onCommentTextChange}
            onAddComment={onAddComment}
            onClose={onClose}
            hasLiked={hasLiked}
            onLike={onLike}
            onShare={onShare}
          />
        )}
      </RemoteDialogContent>
    </RemoteDialog>
  );
}
