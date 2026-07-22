import { createSelector } from "reselect";
import { StreamState, ReactionDetails } from "@/types/stream.types";

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

// Intermediate selector targeting conversations data
export const selectConversationsData = createSelector(
  [selectStreamState],
  (streamState) => streamState?.conversations?.data
);

// Select active conversation object
export const selectActiveConversation = createSelector(
  [selectConversationsData],
  (conversationsData) => conversationsData?.conversation
);

// Select replies inside the active conversation
export const selectActiveReplies = createSelector(
  [selectConversationsData],
  (conversationsData) => conversationsData?.conversation?.replies ?? []
);

// Select the parent post in the active conversation
export const selectActiveParentStream = createSelector(
  [selectConversationsData],
  (conversationsData) => conversationsData?.conversation?.parent ?? null
);

// Select the parent stream ID of the active conversation
export const selectActiveParentStreamId = createSelector(
  [selectActiveParentStream],
  (parent) => parent?.stream_id
);

// Select the parent reaction of the active conversation
export const selectActiveParentReaction = createSelector(
  [selectActiveParentStream],
  (parent) => parent?.reaction?.my_reaction as ReactionDetails | undefined
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

