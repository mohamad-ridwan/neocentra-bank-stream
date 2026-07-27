import React, { useCallback, useMemo } from "react";
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

  const activeUser = useMemo(() => {
    return auth?.user?.username || "Guest User";
  }, [auth?.user?.username]);
  const activeUserFullname = useMemo(() => {
    return auth?.user?.fullname || "Guest User";
  }, [auth?.user?.fullname]);
  const activeUserAvatar = useMemo(() => {
    return auth?.user?.avatar || "";
  }, [auth?.user?.avatar]);

  const triggerToast = useCallback((msg: string) => {
    toast.success(msg);
  }, []);

  const memoizedStreamId = React.useMemo(
    () => streamId ?? activeParentId,
    [streamId, activeParentId],
  );

  const hasLiked = React.useMemo(() => {
    if (myReaction !== undefined) {
      if (myReaction !== null && typeof myReaction === "object") {
        return true;
      }
      return false;
    }
    return !!activeParentReaction;
  }, [myReaction, activeParentReaction]);

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

  const handleCloseConversation = useCallback(() => {
    dispatch(closeConversation());
  }, [dispatch]);

  const handleCommentClick = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return {
    posts,
    activeParent,
    activeUser,
    activeUserFullname,
    activeUserAvatar,
    showComments: activeParentId ? { [activeParentId]: true } : {},
    handleLike,
    handleShare,
    toggleComments,
    handleAddComment,
    handleCloseConversation,
    hasLiked,
    handleCommentClick,
    inputRef,
  };
}
