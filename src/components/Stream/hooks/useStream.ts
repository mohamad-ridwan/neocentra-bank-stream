import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  selectStreamsList,
  selectActiveParentStream,
  selectActiveParentStreamId,
  selectActiveParentReaction,
} from "@/store/selectors/streamSelectors";
import {
  toggleLike,
  incrementShare,
  loadConversation,
  addReply,
  closeConversation,
} from "@/store/slices/streamSlice";
import { ReactionDetails } from "@/types/stream.types";

export function useStream(streamId?: number, myReaction?: ReactionDetails) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const posts = useSelector(selectStreamsList);
  const activeParentId = useSelector(selectActiveParentStreamId);
  const activeParentReaction = useSelector(selectActiveParentReaction);
  const activeParent = useSelector(selectActiveParentStream);
  const auth = useSelector((state: any) => state.auth);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeUser = auth?.user?.username || "Guest User";
  const activeUserFullname = auth?.user?.fullname || "Guest User";
  const activeUserAvatar = auth?.user?.avatar || "";

  const triggerToast = (msg: string) => {
    toast.success(msg);
  };

  const effectiveStreamId = streamId ?? activeParentId;
  const effectiveMyReaction = myReaction ?? activeParentReaction;

  const memoizedStreamId = React.useMemo(
    () => effectiveStreamId,
    [effectiveStreamId],
  );

  const hasLiked = React.useMemo(() => {
    return !!effectiveMyReaction;
  }, [effectiveMyReaction]);

  const handleLike = useCallback(
    (streamIdOrEvent?: number | React.MouseEvent) => {
      const targetId =
        typeof streamIdOrEvent === "number"
          ? streamIdOrEvent
          : memoizedStreamId;
      if (targetId) dispatch(toggleLike(targetId));
    },
    [dispatch, memoizedStreamId],
  );

  const handleShare = useCallback(
    (streamIdOrEvent?: number | React.MouseEvent) => {
      const targetId =
        typeof streamIdOrEvent === "number"
          ? streamIdOrEvent
          : memoizedStreamId;
      if (targetId) {
        dispatch(incrementShare(targetId));
        const post = posts.find((p) => p.stream_id === targetId);
        if (post) {
          triggerToast(`Successfully shared post by ${post.user.fullname}!`);
        }
      }
    },
    [dispatch, posts, memoizedStreamId],
  );

  const toggleComments = useCallback(
    (streamIdOrEvent?: number | React.MouseEvent) => {
      const targetId =
        typeof streamIdOrEvent === "number"
          ? streamIdOrEvent
          : memoizedStreamId;
      if (!targetId) return;

      if (activeParentId === targetId) {
        dispatch(closeConversation());
      } else {
        dispatch(loadConversation(targetId));
      }
    },
    [dispatch, memoizedStreamId, activeParentId],
  );


  const handleAddComment = useCallback(
    (streamIdOrText?: number | string | React.MouseEvent, text?: string) => {
      let targetId = memoizedStreamId;
      let commentText = text;

      if (typeof streamIdOrText === "number") {
        targetId = streamIdOrText;
      } else if (typeof streamIdOrText === "string") {
        commentText = streamIdOrText;
      }

      if (!targetId || !commentText) return;
      const trimmedText = commentText.trim();
      if (!trimmedText) return;

      dispatch(
        addReply({
          streamId: targetId,
          username: activeUser,
          fullname: activeUserFullname,
          avatar: activeUserAvatar,
          content: trimmedText,
        }),
      );

      triggerToast("Comment posted!");
    },
    [
      dispatch,
      activeUser,
      activeUserFullname,
      activeUserAvatar,
      memoizedStreamId,
    ],
  );

  const handleCopyLink = useCallback(
    (streamId: number, customLink?: string) => {
      if (typeof window !== "undefined" && navigator.clipboard) {
        const demoLink =
          customLink || `${window.location.origin}/stream/post/${streamId}`;
        navigator.clipboard
          .writeText(demoLink)
          .then(() => {
            toast.success("Link copied");
          })
          .catch((err) => {
            console.error("Failed to copy link: ", err);
            toast.error("Link copy failed");
          });
      } else {
        toast.error("Link copy failed");
      }
    },
    [],
  );

  const handleCloseConversation = useCallback(() => {
    dispatch(closeConversation());
  }, [dispatch]);

  const handleCommentClick = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    posts,
    activeParent,
    activeUser,
    activeUserFullname,
    activeUserAvatar,
    showComments: activeParentId ? { [activeParentId]: true } : {},
    toastMessage,
    handleLike,
    handleShare,
    toggleComments,
    handleAddComment,
    handleCopyLink,
    handleCloseConversation,
    hasLiked,
    handleCommentClick,
    inputRef,
  };
}

