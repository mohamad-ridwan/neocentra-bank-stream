import React from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import ConversationModalContent from "./conversation";
import { selectActiveParentStreamId } from "@/store/selectors/streamSelectors";

const RemoteDialog = dynamic(
  () => import("shared_remote/Dialog").then((m) => m.Dialog),
  { ssr: false },
);

const RemoteDialogContent = dynamic(
  () => import("shared_remote/Dialog").then((m) => m.DialogContent),
  { ssr: false },
);

interface CommentsSectionProps {
  streamId: number;
  commentsCount: number;
  onClose: () => void;
}

export default function CommentsSection({
  streamId,
  commentsCount,
  onClose,
}: CommentsSectionProps) {
  // The dialog is open if this section's stream ID matches the active conversation's parent ID
  const activeParentId = useSelector(selectActiveParentStreamId);

  const isOpen = activeParentId === streamId;

  return (
    <RemoteDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <RemoteDialogContent className="fixed inset-0 left-0 top-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none bg-transparent border-none shadow-none p-0 rounded-none flex flex-col md:flex-row">
        {isOpen && <ConversationModalContent onClose={onClose} />}
      </RemoteDialogContent>
    </RemoteDialog>
  );
}
