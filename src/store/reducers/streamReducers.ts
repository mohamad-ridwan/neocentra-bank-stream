import { PayloadAction } from "@reduxjs/toolkit";
import { StreamState, ReplyPost } from "@/types/stream.types";
import { INITIAL_MOCK_REPLIES } from "@/models/stream";

export const loadConversationReducer = (
  state: StreamState,
  action: PayloadAction<number>
) => {
  const streamId = action.payload;
  const parentPost =
    state.streams.data.stream.find((p) => p.stream_id === streamId) || null;
  const conversationRecord = INITIAL_MOCK_REPLIES.find(
    (r) => r.stream_id === streamId
  );
  const replies = conversationRecord ? conversationRecord.replies : [];

  state.conversations.data.conversation = {
    parent: parentPost,
    replies: replies,
  };
  state.conversations.data.pagination.total = replies.length;
  state.conversations.message =
    "Conversation stream posts retrieved successfully";
};

export const toggleLikeReducer = (
  state: StreamState,
  action: PayloadAction<number>
) => {
  const streamId = action.payload;

  // Update in stream list
  const post = state.streams.data.stream.find(
    (p) => p.stream_id === streamId
  );
  if (post) {
    const isLiked = !!post.reaction.my_reaction;
    if (isLiked) {
      post.reaction.my_reaction = null;
      post.total_likes = Math.max(0, post.total_likes - 1);
    } else {
      post.reaction.my_reaction = {
        reaction: "❤️",
        side: "REACTION_SIDE_LIKE",
      };
      post.total_likes += 1;
    }
  }

  // Update in active conversation if matches parent
  const activeConv = state.conversations.data.conversation;
  if (
    activeConv &&
    activeConv.parent &&
    activeConv.parent.stream_id === streamId
  ) {
    const isLiked = !!activeConv.parent.reaction.my_reaction;
    if (isLiked) {
      activeConv.parent.reaction.my_reaction = null;
      activeConv.parent.total_likes = Math.max(
        0,
        activeConv.parent.total_likes - 1
      );
    } else {
      activeConv.parent.reaction.my_reaction = {
        reaction: "❤️",
        side: "REACTION_SIDE_LIKE",
      };
      activeConv.parent.total_likes += 1;
    }
  }
};

export const incrementShareReducer = (
  state: StreamState,
  action: PayloadAction<number>
) => {
  const streamId = action.payload;
  const post = state.streams.data.stream.find(
    (p) => p.stream_id === streamId
  );
  if (post) {
    post.shares = (post.shares || 0) + 1;
  }

  const activeConv = state.conversations.data.conversation;
  if (
    activeConv &&
    activeConv.parent &&
    activeConv.parent.stream_id === streamId
  ) {
    activeConv.parent.shares = (activeConv.parent.shares || 0) + 1;
  }
};

export const addReplyReducer = (
  state: StreamState,
  action: PayloadAction<{
    streamId: number;
    username: string;
    fullname: string;
    avatar: string;
    content: string;
  }>
) => {
  const { streamId, username, fullname, avatar, content } = action.payload;

  const newReply: ReplyPost = {
    parent_stream_id: streamId,
    stream_id: Date.now(),
    reply_to: streamId,
    reply_content: {
      avatar,
      content_original: content,
      created: "Just now",
      fullname,
      user_id: Date.now(),
      username,
    },
    content_original: content,
    created_at: new Date().toISOString(),
    created_display: "Just now",
    reaction: {
      my_reaction: null,
      reactions: [],
      total: 0,
    },
    total_likes: 0,
    total_replies: 0,
    user: {
      avatar,
      fullname,
      user_id: Date.now(),
      username,
    },
  };

  // Push to active conversation replies if it matches the parent stream ID
  const activeConv = state.conversations.data.conversation;
  if (
    activeConv &&
    activeConv.parent &&
    activeConv.parent.stream_id === streamId
  ) {
    activeConv.replies = [...activeConv.replies, newReply];
    activeConv.parent.total_replies += 1;
    state.conversations.data.pagination.total = activeConv.replies.length;
  }

  // Also increment total replies in feed stream list
  const post = state.streams.data.stream.find(
    (p) => p.stream_id === streamId
  );
  if (post) {
    post.total_replies += 1;
  }
};
