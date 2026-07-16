import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStreamsList,
  selectActiveConversation,
} from "@/store/selectors/streamSelectors";
import {
  toggleLike,
  incrementShare,
  loadConversation,
  addReply,
} from "@/store/slices/streamSlice";

export function useStream() {
  const dispatch = useDispatch();
  const posts = useSelector(selectStreamsList);
  const activeConversation = useSelector(selectActiveConversation);
  const auth = useSelector((state: any) => state.auth);

  const [newCommentTexts, setNewCommentTexts] = useState<
    Record<number, string>
  >({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeUser = auth?.user?.username || "Guest User";
  const activeUserFullname = auth?.user?.fullname || "Guest User";
  const activeUserAvatar = auth?.user?.avatar || "";

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLike = (streamId: number) => {
    dispatch(toggleLike(streamId));
  };

  const handleShare = (streamId: number) => {
    dispatch(incrementShare(streamId));
    const post = posts.find((p) => p.stream_id === streamId);
    if (post) {
      triggerToast(`Successfully shared post by ${post.user.fullname}!`);
    }
  };

  const toggleComments = (streamId: number) => {
    const isOpening = !showComments[streamId];
    setShowComments((prev) => ({
      ...prev,
      [streamId]: isOpening,
    }));

    if (isOpening) {
      dispatch(loadConversation(streamId));
    }
  };

  const handleCommentTextChange = (streamId: number, text: string) => {
    setNewCommentTexts((prev) => ({
      ...prev,
      [streamId]: text,
    }));
  };

  const handleAddComment = (streamId: number, e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentTexts[streamId]?.trim();
    if (!text) return;

    dispatch(
      addReply({
        streamId,
        username: activeUser,
        fullname: activeUserFullname,
        avatar: activeUserAvatar,
        content: text,
      }),
    );

    setNewCommentTexts((prev) => ({
      ...prev,
      [streamId]: "",
    }));
    triggerToast("Comment posted!");
  };

  return {
    posts,
    activeConversation,
    activeUser,
    activeUserFullname,
    activeUserAvatar,
    newCommentTexts,
    showComments,
    toastMessage,
    handleLike,
    handleShare,
    toggleComments,
    handleCommentTextChange,
    handleAddComment,
  };
}
