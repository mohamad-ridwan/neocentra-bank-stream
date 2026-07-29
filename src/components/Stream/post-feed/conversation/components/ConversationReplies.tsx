import React, { useMemo } from "react";
import { List } from "react-window";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { ReplyPost } from "@/types/stream.types";
import {
  selectActiveParentStream,
  selectActiveParentStreamId,
  selectActiveReplies,
  selectConversationPagination,
} from "@/store/selectors/streamSelectors";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";
import { useConversationReplies } from "../hooks/useConversationReplies";
import { ParentPost } from "./ParentPost";
import { ConversationLoading } from "./ConversationLoading";
import ImageContent from "../../ImageContent";

interface ReplyItemProps {
  reply: ReplyPost;
  onCommentToggle: () => void;
}

const ReplyItem = React.memo(
  function ReplyItem({ reply, onCommentToggle }: Readonly<ReplyItemProps>) {
    const hasReplyLiked = !!reply.reaction.my_reaction;
    const postHeaderData = useMemo(() => {
      return {
        user_id: reply?.user?.user_id,
        fullname: reply?.user?.fullname,
        avatar: reply?.user?.avatar,
        username: reply?.user?.username,
        role: reply?.user?.role,
        isVerified: reply?.user?.isVerified,
        created_display: reply?.created_display,
        stream_id: reply.stream_id,
      };
    }, [
      reply?.user?.user_id,
      reply?.user?.fullname,
      reply?.user?.avatar,
      reply?.user?.username,
      reply?.user?.role,
      reply?.user?.isVerified,
      reply?.created_display,
      reply.stream_id,
    ]);
    return (
      <div className="bg-slate-900/30 border border-slate-800/40 hover:border-slate-800/80 rounded-2xl p-4 transition-all duration-200">
        <PostHeader post={postHeaderData} size="xs" hideMenu={true} />
        <PostContent
          content={reply.content_original}
          size="xs"
          className="pl-8"
        />
        {reply?.images && reply.images.length > 0 && (
          <ImageContent images={reply.images} streamId={reply.stream_id} />
        )}
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
  },
  (prev, next) => {
    return (
      prev.reply?.stream_id === next.reply?.stream_id &&
      prev.reply?.reaction?.my_reaction === next.reply?.reaction?.my_reaction
    );
  },
);

interface ParentPostRowProps {
  style: React.CSSProperties;
  onCommentToggle: () => void;
}

const ParentPostRow = React.memo(function ParentPostRow({
  style,
  onCommentToggle,
}: Readonly<ParentPostRowProps>) {
  const parent = useSelector(selectActiveParentStream);

  if (!parent) return null;

  return (
    <div style={style} className="pt-6 pb-6 pr-2">
      <ParentPost parent={parent} onCommentClick={onCommentToggle} />
    </div>
  );
});

interface RepliesHeaderRowProps {
  style: React.CSSProperties;
  isTopPadding?: boolean;
}

const RepliesHeaderRow = React.memo(function RepliesHeaderRow({
  style,
  isTopPadding,
}: Readonly<RepliesHeaderRowProps>) {
  const replies = useSelector(selectActiveReplies);
  const paddingClass = isTopPadding ? "pt-4 pb-2 pr-2" : "pt-6 pb-2 pr-2";

  return (
    <div style={style} className={paddingClass}>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
        Replies ({replies.length})
      </h4>
    </div>
  );
});

interface LoadMoreRowProps {
  style: React.CSSProperties;
  isLoading: boolean;
  onLoadMore: () => void;
}

const LoadMoreRow = React.memo(function LoadMoreRow({
  style,
  isLoading,
  onLoadMore,
}: Readonly<LoadMoreRowProps>) {
  return (
    <div style={style} className="pb-4 pr-2">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900/60 border border-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700 text-xs font-semibold text-slate-350 hover:text-white transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
        )}
        <span>Load Previous Conversation</span>
      </button>
    </div>
  );
});

interface EmptyRepliesRowProps {
  style: React.CSSProperties;
}

const EmptyRepliesRow = React.memo(function EmptyRepliesRow({
  style,
}: Readonly<EmptyRepliesRowProps>) {
  return (
    <div style={style} className="pt-2 pb-6 pr-2">
      <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
        No replies yet. Be the first to start the conversation!
      </div>
    </div>
  );
});

interface ReplyRowContainerProps {
  style: React.CSSProperties;
  index: number;
  onCommentToggle: () => void;
}

const ReplyRowContainer = React.memo(function ReplyRowContainer({
  style,
  index,
  onCommentToggle,
}: Readonly<ReplyRowContainerProps>) {
  const replies = useSelector(selectActiveReplies);

  const reply = replies[replies.length - 1 - index];

  if (!reply) return null;

  return (
    <div style={style} className="pb-3 pr-2">
      <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
    </div>
  );
});

interface RowProps {
  index: number;
  style: React.CSSProperties;
  hasParent: boolean;
  isLoading: boolean;
  onCommentToggle: () => void;
  showLoadMore: boolean;
  onLoadMore: () => void;
  rowCount: number;
}

const Row = React.memo(function Row({
  index,
  style,
  hasParent,
  isLoading,
  onCommentToggle,
  showLoadMore,
  onLoadMore,
  rowCount,
}: Readonly<RowProps>) {
  const rowStyle = {
    ...style,
    transform: `${style.transform || ""} scaleY(-1)`,
  };

  if (hasParent) {
    if (index === rowCount - 1) {
      return (
        <ParentPostRow style={rowStyle} onCommentToggle={onCommentToggle} />
      );
    }

    if (index === rowCount - 2) {
      return <RepliesHeaderRow style={rowStyle} isTopPadding={false} />;
    }

    if (showLoadMore) {
      if (index === rowCount - 3) {
        return (
          <LoadMoreRow
            style={rowStyle}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
          />
        );
      }

      return (
        <ReplyRowContainer
          style={rowStyle}
          index={index}
          onCommentToggle={onCommentToggle}
        />
      );
    } else {
      // showLoadMore is false
      if (index === rowCount - 3 && rowCount === 3) {
        return <EmptyRepliesRow style={rowStyle} />;
      }

      return (
        <ReplyRowContainer
          style={rowStyle}
          index={index}
          onCommentToggle={onCommentToggle}
        />
      );
    }
  } else {
    // No parent
    if (index === rowCount - 1) {
      return <RepliesHeaderRow style={rowStyle} isTopPadding={true} />;
    }

    if (showLoadMore) {
      if (index === rowCount - 2) {
        return (
          <LoadMoreRow
            style={rowStyle}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
          />
        );
      }

      return (
        <ReplyRowContainer
          style={rowStyle}
          index={index}
          onCommentToggle={onCommentToggle}
        />
      );
    } else {
      // showLoadMore is false
      if (index === rowCount - 2 && rowCount === 2) {
        return <EmptyRepliesRow style={rowStyle} />;
      }

      return (
        <ReplyRowContainer
          style={rowStyle}
          index={index}
          onCommentToggle={onCommentToggle}
        />
      );
    }
  }
});

Row.displayName = "ConversationReplyRow";

interface ConversationRepliesProps {
  onCommentToggle: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const ConversationReplies = React.memo(
  function ConversationReplies({
    onCommentToggle,
    scrollContainerRef,
  }: Readonly<ConversationRepliesProps>) {
    const parentStreamId = useSelector(selectActiveParentStreamId);
    const activeReplies = useSelector(selectActiveReplies);
    const pagination = useSelector(selectConversationPagination);

    const hasParent = useMemo(() => {
      return parentStreamId ?? 0;
    }, [parentStreamId]);
    const repliesCount = useMemo(() => {
      return activeReplies?.length ?? 0;
    }, [activeReplies]);

    const isLastPage = useMemo(() => {
      return pagination?.is_last_page ?? false;
    }, [pagination?.is_last_page]);

    const {
      viewportHeight,
      wrapperRef,
      listRef,
      rowHeight,
      wrapperHeight,
      isLoading,
      loadMore,
      isReady,
    } = useConversationReplies({
      replies: activeReplies,
      parentStreamId,
      isLastPage,
      scrollContainerRef,
    });

    const showLoadMore = useMemo(() => {
      return isLastPage;
    }, [isLastPage]);

    const rowCount = useMemo(() => {
      let count = 0;
      if (hasParent) {
        count += 2; // ParentPost + Header
      } else {
        count += 1; // Header
      }
      if (showLoadMore) {
        count += 1; // Button row
      }
      if (repliesCount === 0 && !showLoadMore) {
        count += 1; // Empty state helper
      } else {
        count += repliesCount;
      }
      return count;
    }, [hasParent, showLoadMore, repliesCount]);

    return (
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
          <ConversationLoading isReady={isReady} />
          <div
            className={`w-full h-full transition-opacity duration-300 ${
              isReady ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <List
              listRef={listRef}
              rowCount={rowCount}
              rowHeight={rowHeight}
              rowComponent={Row as any}
              rowProps={{
                hasParent,
                isLoading,
                onCommentToggle,
                showLoadMore,
                onLoadMore: loadMore,
                rowCount,
              }}
              className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                overflowAnchor: "none",
              }}
              overscanCount={2}
            />
          </div>
        </div>
      </div>
    );
  },
  (prev, next) => {
    return prev.scrollContainerRef.current === next.scrollContainerRef.current;
  },
);
