import { createSlice } from "@reduxjs/toolkit";
import { StreamState } from "@/types/stream.types";
import { INITIAL_STREAM_POSTS } from "@/models/stream";
import {
  loadConversationReducer,
  toggleLikeReducer,
  incrementShareReducer,
  addReplyReducer,
  appendStreamsReducer,
  prependConversationRepliesReducer,
} from "../reducers/streamReducers";

const initialState: StreamState = {
  streams: {
    data: {
      pagination: {
        is_last_page: false,
        total: 80,
      },
      stream: INITIAL_STREAM_POSTS,
    },
    message: "3 stream post(s) retrieved",
  },
  conversations: {
    data: {
      conversation: null,
      pagination: {
        is_last_page: true,
        total: 0,
      },
    },
    message: "",
  },
};

export const streamSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {
    loadConversation: loadConversationReducer,
    toggleLike: toggleLikeReducer,
    incrementShare: incrementShareReducer,
    addReply: addReplyReducer,
    appendStreams: appendStreamsReducer,
    prependConversationReplies: prependConversationRepliesReducer,
  },
});

export const {
  loadConversation,
  toggleLike,
  incrementShare,
  addReply,
  appendStreams,
  prependConversationReplies,
} = streamSlice.actions;
export default streamSlice.reducer;

