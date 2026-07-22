import { createSelector } from "reselect";
import { StreamState } from "@/types/stream.types";

// Base selector targeting the injected "streams" key
export const selectStreamState = (state: any): StreamState => state.streams;

// Select list of streams
export const selectStreamsList = createSelector(
  [selectStreamState],
  (streamState) => streamState?.streams?.data?.stream ?? []
);

// Select pagination of streams
export const selectStreamsPagination = createSelector(
  [selectStreamState],
  (streamState) => streamState?.streams?.data?.pagination
);

// Select active conversation object
export const selectActiveConversation = createSelector(
  [selectStreamState],
  (streamState) => streamState?.conversations?.data?.conversation
);

// Select replies inside the active conversation
export const selectActiveReplies = createSelector(
  [selectActiveConversation],
  (conversation) => conversation?.replies ?? []
);

// Select the parent post in the active conversation
export const selectActiveParentStream = createSelector(
  [selectActiveConversation],
  (conversation) => conversation?.parent
);

// Select conversation pagination state
export const selectConversationPagination = createSelector(
  [selectStreamState],
  (streamState) => streamState?.conversations?.data?.pagination
);

// Select whether a reply has been added
export const selectIsReplyAdded = createSelector(
  [selectStreamState],
  (streamState) => streamState?.conversations?.data?.isReplyAdded ?? false
);

