import React from "react";
import { List } from "react-window";
import { ReplyPost } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";
import PostSkeleton from "../../loaders/PostSkeleton";
import { useConversationReplies } from "../hooks/useConversationReplies";

interface ReplyItemProps {
  reply: ReplyPost;
  onCommentToggle: () => void;
}

const ReplyItem = React.memo(function ReplyItem({
  reply,
  onCommentToggle,
}: Readonly<ReplyItemProps>) {
  const hasReplyLiked = !!reply.reaction.my_reaction;
  return (
    <div className="bg-slate-900/30 border border-slate-800/40 hover:border-slate-800/80 rounded-2xl p-4 transition-all duration-200">
      <PostHeader post={reply} size="xs" hideMenu={true} />
      <PostContent
        content={reply.content_original}
        size="xs"
        className="pl-8"
      />
      <div className="pl-8 mt-2">
        <PostActionBar
          post={reply}
          hasLiked={hasReplyLiked}
          onLike={() => {
            console.log("Like reply:", reply.stream_id);
          }}
          onCommentToggle={onCommentToggle}
          onShare={() => {
            console.log("Share reply:", reply.stream_id);
          }}
          size="xs"
        />
      </div>
    </div>
  );
});

interface RowProps {
  index: number;
  style: React.CSSProperties;
  replies: ReplyPost[];
  isLoading: boolean;
  onCommentToggle: () => void;
}

const Row = React.memo(function Row({
  index,
  style,
  replies,
  isLoading,
  onCommentToggle,
}: Readonly<RowProps>) {


  // Skeletons are placed at index 0 and 1 when loading older replies
  if (isLoading) {
    if (index === 0 || index === 1) {
      return (
        <div style={style} className="pb-3 pr-2">
          <PostSkeleton size="xs" />
        </div>
      );
    }

    const reply = replies[index - 2];
    if (!reply) return null;
    return (
      <div style={style} className="pb-3 pr-2">
        <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
      </div>
    );
  }

  const reply = replies[index];
  if (!reply) return null;
  return (
    <div style={style} className="pb-3 pr-2">
      <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
    </div>
  );
});

Row.displayName = "ConversationReplyRow";

interface ConversationRepliesProps {
  parentStreamId: number;
  replies: ReplyPost[];
  onCommentToggle: () => void;
  isLastPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const ConversationReplies = React.memo(function ConversationReplies({
  parentStreamId,
  replies,
  onCommentToggle,
  isLastPage,
  scrollContainerRef,
}: Readonly<ConversationRepliesProps>) {
  const {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
    onRowsRendered,
    isLoading,
  } = useConversationReplies({
    replies,
    parentStreamId,
    isLastPage,
    scrollContainerRef,
  });

  const rowCount = isLoading ? replies.length + 2 : replies.length;

  return (
    <div className="space-y-4 pb-16">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
        Replies ({replies.length})
      </h4>

      {replies.length > 0 || isLoading ? (
        <div
          ref={wrapperRef}
          style={{ position: "relative", height: wrapperHeight, width: "100%" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: viewportHeight,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <List
              listRef={listRef}
              rowCount={rowCount}
              rowHeight={rowHeight}
              rowComponent={Row as any}
              onRowsRendered={onRowsRendered}
              rowProps={{
                replies,
                isLoading,
                onCommentToggle,
              }}
              className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              style={{ height: "100%", width: "100%", overflow: "hidden" }}
              overscanCount={5}
            />
          </div>
        </div>
      ) : (
        <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
          No replies yet. Be the first to start the conversation!
        </div>
      )}
    </div>
  );
});
