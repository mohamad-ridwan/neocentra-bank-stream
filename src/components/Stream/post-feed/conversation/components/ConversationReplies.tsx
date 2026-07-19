import React from "react";
import { ReplyPost } from "@/types/stream.types";
import PostHeader from "../../PostHeader";
import PostContent from "../../PostContent";
import PostActionBar from "../../PostActionBar";

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

interface ConversationRepliesProps {
  replies: ReplyPost[];
  onCommentToggle: () => void;
}

export const ConversationReplies = React.memo(function ConversationReplies({
  replies,
  onCommentToggle,
}: Readonly<ConversationRepliesProps>) {
  return (
    <div className="space-y-4 pb-16">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
        Replies ({replies.length})
      </h4>

      {replies.length > 0 ? (
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyItem
              key={reply.stream_id}
              reply={reply}
              onCommentToggle={onCommentToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-slate-500 text-xs py-8 text-center bg-slate-900/10 border border-dashed border-slate-800/50 rounded-2xl">
          No replies yet. Be the first to start the conversation!
        </div>
      )}
    </div>
  );
});
