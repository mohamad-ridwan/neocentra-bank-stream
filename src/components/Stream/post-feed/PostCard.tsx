import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { StreamPost, ReactionDetails } from "@/types/stream.types";
import { selectActiveParentStreamId } from "@/store/selectors/streamSelectors";
import { useStream } from "../hooks/useStream";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActionBar from "./PostActionBar";
import CommentsSection from "./CommentsSection";

interface PostCardProps {
  post: StreamPost;
  onLike?: () => void;
  onShare?: () => void;
  onCommentToggle?: () => void;
  forceOpenTooltip?: boolean;
  forceOpenMenu?: boolean;
  forceHoverLike?: boolean;
  forceHoverComment?: boolean;
  forceCopyLinkHover?: boolean;
  demoLink?: string;
}

const PostCard = memo(
  ({
    post,
    onLike,
    onShare,
    onCommentToggle,
    forceOpenTooltip,
    forceOpenMenu,
    forceHoverLike,
    forceHoverComment,
    forceCopyLinkHover,
    demoLink,
  }: Readonly<PostCardProps>) => {
    const {
      hasLiked,
      handleLike,
      handleShare,
      toggleComments,
      handleCloseConversation,
    } = useStream(
      post.stream_id,
      post.reaction?.my_reaction as ReactionDetails,
    );

    console.log("render post card");

    const activeParentId = useSelector(selectActiveParentStreamId);
    const showComments = useMemo(() => {
      return activeParentId === post.stream_id;
    }, [activeParentId, post?.stream_id]);

    const handleLikeClick = onLike || (() => handleLike(post.stream_id));
    const handleShareClick = onShare || (() => handleShare(post.stream_id));
    const handleCommentToggleClick =
      onCommentToggle || (() => toggleComments(post.stream_id));

    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        <PostHeader
          post={post}
          forceOpenTooltip={forceOpenTooltip}
          forceOpenMenu={forceOpenMenu}
          forceCopyLinkHover={forceCopyLinkHover}
          demoLink={demoLink}
        />
        <PostContent content={post.content_original} />
        <PostActionBar
          post={post}
          hasLiked={hasLiked}
          onLike={handleLikeClick}
          onCommentToggle={handleCommentToggleClick}
          onShare={handleShareClick}
          forceHoverLike={forceHoverLike}
          forceHoverComment={forceHoverComment}
        />
        {showComments && (
          <CommentsSection
            streamId={post.stream_id}
            onClose={handleCloseConversation}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.post?.stream_id === nextProps.post?.stream_id &&
      prevProps.post?.reaction?.my_reaction ===
        nextProps.post?.reaction?.my_reaction
    );
  },
);

export default PostCard;
