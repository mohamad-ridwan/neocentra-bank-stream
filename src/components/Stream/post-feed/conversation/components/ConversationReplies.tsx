import React from "react";
import { List } from "react-window";
import { Loader2 } from "lucide-react";
import { ReplyPost, StreamPost } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";
import { useConversationReplies } from "../hooks/useConversationReplies";
import { ParentPost } from "./ParentPost";
import PostSkeleton from "@/components/Stream/post-feed/loaders/PostSkeleton";

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
  parent: StreamPost | null;
  parentHasLiked: boolean;
  onParentLike: () => void;
  onParentShare: () => void;
  replies: ReplyPost[];
  isLoading: boolean;
  onCommentToggle: () => void;
  showLoadMore: boolean;
  onLoadMore: () => void;
}

const Row = React.memo(function Row({
  index,
  style,
  parent,
  parentHasLiked,
  onParentLike,
  onParentShare,
  replies,
  isLoading,
  onCommentToggle,
  showLoadMore,
  onLoadMore,
}: Readonly<RowProps>) {
  if (parent) {
    if (index === 0) {
      return (
        <div style={style} className="pt-6 pb-6 pr-2">
          <ParentPost
            parent={parent}
            hasLiked={parentHasLiked}
            onLike={onParentLike}
            onShare={onParentShare}
            onCommentClick={onCommentToggle}
          />
        </div>
      );
    }

    if (index === 1) {
      return (
        <div style={style} className="pt-6 pb-2 pr-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Replies ({replies.length})
          </h4>
        </div>
      );
    }

    if (showLoadMore) {
      if (index === 2) {
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
      }

      const reply = replies[index - 3];
      if (!reply) return null;
      return (
        <div style={style} className="pb-3 pr-2">
          <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
        </div>
      );
    } else {
      // showLoadMore is false
      if (replies.length === 0) {
        if (index === 2) {
          return (
            <div style={style} className="pt-2 pb-6 pr-2">
              <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
                No replies yet. Be the first to start the conversation!
              </div>
            </div>
          );
        }
        return null;
      }

      const reply = replies[index - 2];
      if (!reply) return null;
      return (
        <div style={style} className="pb-3 pr-2">
          <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
        </div>
      );
    }
  } else {
    // No parent
    if (index === 0) {
      return (
        <div style={style} className="pt-4 pb-2 pr-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Replies ({replies.length})
          </h4>
        </div>
      );
    }

    if (showLoadMore) {
      if (index === 1) {
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
      }

      const reply = replies[index - 2];
      if (!reply) return null;
      return (
        <div style={style} className="pb-3 pr-2">
          <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
        </div>
      );
    } else {
      // showLoadMore is false
      if (replies.length === 0) {
        if (index === 1) {
          return (
            <div style={style} className="pt-2 pb-6 pr-2">
              <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
                No replies yet. Be the first to start the conversation!
              </div>
            </div>
          );
        }
        return null;
      }

      const reply = replies[index - 1];
      if (!reply) return null;
      return (
        <div style={style} className="pb-3 pr-2">
          <ReplyItem reply={reply} onCommentToggle={onCommentToggle} />
        </div>
      );
    }
  }
});

Row.displayName = "ConversationReplyRow";

interface ConversationRepliesProps {
  parent: StreamPost | null;
  hasLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  parentStreamId: number;
  replies: ReplyPost[];
  onCommentToggle: () => void;
  isLastPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const ConversationReplies = React.memo(function ConversationReplies({
  parent,
  hasLiked,
  onLike,
  onShare,
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
    isLoading,
    loadMore,
    isReady,
  } = useConversationReplies({
    parent,
    replies,
    parentStreamId,
    isLastPage,
    scrollContainerRef,
  });

  const showLoadMore = isLastPage;

  let rowCount = 0;
  if (parent) {
    rowCount += 2; // ParentPost + Header
    if (showLoadMore) {
      rowCount += 1; // Button row
    }
    if (replies.length === 0 && !showLoadMore) {
      rowCount += 1; // Empty state helper
    } else {
      rowCount += replies.length;
    }
  } else {
    rowCount += 1; // Header
    if (showLoadMore) {
      rowCount += 1; // Button row
    }
    if (replies.length === 0 && !showLoadMore) {
      rowCount += 1; // Empty state helper
    } else {
      rowCount += replies.length;
    }
  }

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
        {!isReady && (
          <div className="absolute inset-0 bg-slate-950 z-30 pt-16 pr-2 space-y-6">
            {parent && (
              <div className="pb-6 border-b border-slate-800/40">
                <PostSkeleton size="md" />
              </div>
            )}
            <div className="pt-2">
              <div className="h-4 bg-slate-800/40 rounded-md w-28 mb-4 animate-pulse" />
              <div className="space-y-4">
                {/* <PostSkeleton size="xs" /> */}
                <PostSkeleton size="xs" />
                <PostSkeleton size="xs" />
              </div>
            </div>
          </div>
        )}
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
              parent,
              parentHasLiked: hasLiked,
              onParentLike: onLike,
              onParentShare: onShare,
              replies,
              isLoading,
              onCommentToggle,
              showLoadMore,
              onLoadMore: loadMore,
            }}
            className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            style={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
              overflowAnchor: "none",
            }}
            overscanCount={5}
          />
        </div>
      </div>
    </div>
  );
});
