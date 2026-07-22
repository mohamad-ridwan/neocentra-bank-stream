import { PayloadAction } from "@reduxjs/toolkit";
import { StreamState, ReplyPost, StreamPost } from "@/types/stream.types";
import { INITIAL_MOCK_REPLIES } from "@/models/stream";

export const loadConversationReducer = (
  state: StreamState,
  action: PayloadAction<number>,
) => {
  const streamId = action.payload;
  const parentPost =
    state.streams.data.stream.find((p) => p.stream_id === streamId) || null;
  const conversationRecord = INITIAL_MOCK_REPLIES.find(
    (r) => r.stream_id === streamId,
  );
  const rawReplies = conversationRecord ? conversationRecord.replies : [];

  // Sort replies chronologically from oldest to newest
  const replies = [...rawReplies].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  // Slice initial replies for demo: take last 20 replies
  const initialCount = Math.min(20, replies.length);
  const slicedReplies = replies.slice(-initialCount);

  state.conversations.data.conversation = {
    parent: parentPost,
    replies: slicedReplies,
  };

  // If total replies > 20, set total to 200 for the pagination demo, else use actual replies length
  const hasMore = replies.length > 20;
  state.conversations.data.pagination.total = hasMore ? 200 : replies.length;
  state.conversations.data.pagination.is_last_page = hasMore;
  state.conversations.message =
    "Conversation stream posts retrieved successfully";
};

export const prependConversationRepliesReducer = (
  state: StreamState,
  action: PayloadAction<{
    replies: ReplyPost[];
  }>,
) => {
  const { replies } = action.payload;
  const activeConv = state.conversations.data.conversation;
  if (activeConv) {
    // Sort incoming (older) replies oldest to newest
    const sortedReplies = [...replies].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    // Prepend the new replies
    activeConv.replies = [...sortedReplies, ...activeConv.replies];

    // Increment total replies count in parent post
    if (activeConv.parent) {
      activeConv.parent.total_replies += replies.length;

      // Update total replies in feed stream list
      const post = state.streams.data.stream.find(
        (p) => p.stream_id === activeConv.parent!.stream_id,
      );
      if (post) {
        post.total_replies += replies.length;
      }
    }

    // Check if we have reached or exceeded the total limit
    const currentCount = activeConv.replies.length;
    const total = state.conversations.data.pagination.total;
    if (currentCount >= total) {
      state.conversations.data.pagination.is_last_page = false;
    }
  }
};

export const toggleLikeReducer = (
  state: StreamState,
  action: PayloadAction<number>,
) => {
  const streamId = action.payload;

  // Update in stream list
  const post = state.streams.data.stream.find((p) => p.stream_id === streamId);
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
        activeConv.parent.total_likes - 1,
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
  action: PayloadAction<number>,
) => {
  const streamId = action.payload;
  const post = state.streams.data.stream.find((p) => p.stream_id === streamId);
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
  }>,
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
    state.conversations.data.isReplyAdded = true;
  }

  // Also increment total replies in feed stream list
  const post = state.streams.data.stream.find((p) => p.stream_id === streamId);
  if (post) {
    post.total_replies += 1;
  }
};

export const appendStreamsReducer = (
  state: StreamState,
  action: PayloadAction<StreamPost[]>,
) => {
  if (state.streams.data.pagination.is_last_page) return;

  state.streams.data.stream.push(...action.payload);

  state.streams.message = `${state.streams.data.stream.length} stream post(s) retrieved`;

  if (state.streams.data.stream.length >= state.streams.data.pagination.total) {
    state.streams.data.pagination.is_last_page = true;
  }
};

export const setIsReplyAddedReducer = (
  state: StreamState,
  action: PayloadAction<boolean>,
) => {
  state.conversations.data.isReplyAdded = action.payload;
};

export const closeConversationReducer = (state: StreamState) => {
  state.conversations.data.conversation = null;
};
