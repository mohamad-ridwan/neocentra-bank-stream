import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StreamState } from "@/types/stream.types";
import { INITIAL_STREAM_POSTS } from "@/models/stream";
import {
  loadConversationReducer,
  toggleLikeReducer,
  incrementShareReducer,
  addReplyReducer,
  appendStreamsReducer,
  prependConversationRepliesReducer,
  setIsReplyAddedReducer,
  closeConversationReducer,
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
      isReplyAdded: false,
      pagination: {
        is_last_page: true,
        total: 100,
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
    setIsReplyAdded: setIsReplyAddedReducer,
    closeConversation: closeConversationReducer,
  },
});

export const {
  loadConversation,
  toggleLike,
  incrementShare,
  addReply,
  appendStreams,
  prependConversationReplies,
  setIsReplyAdded,
  closeConversation,
} = streamSlice.actions;

export default streamSlice.reducer;
