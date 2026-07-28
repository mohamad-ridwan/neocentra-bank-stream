import React, { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { StreamPost, ReactionDetails } from "@/types/stream.types";
import { selectActiveParentStreamId } from "@/store/selectors/streamSelectors";
import { useStream } from "../hooks/useStream";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import ImageContent from "./ImageContent";
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

    const activeParentId = useSelector(selectActiveParentStreamId);
    const showComments = useMemo(() => {
      return activeParentId === post.stream_id;
    }, [activeParentId, post?.stream_id]);

    const handleLikeClick = useCallback(() => {
      handleLike(post.stream_id);
    }, [post.stream_id]);
    const handleShareClick = useCallback(() => {
      handleShare(post.stream_id);
    }, [post.stream_id]);
    const handleCommentToggleClick = useCallback(() => {
      toggleComments(post.stream_id);
    }, [post.stream_id]);

    const postHeaderData = useMemo(() => {
      return {
        user_id: post?.user?.user_id,
        fullname: post?.user?.fullname,
        avatar: post?.user?.avatar,
        username: post?.user?.username,
        role: post?.user?.role,
        isVerified: post?.user?.isVerified,
        created_display: post?.created_display,
        stream_id: post.stream_id,
      };
    }, [
      post?.user?.user_id,
      post?.user?.fullname,
      post?.user?.avatar,
      post?.user?.username,
      post?.user?.role,
      post?.user?.isVerified,
      post?.created_display,
      post.stream_id,
    ]);

    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        <PostHeader
          post={postHeaderData}
          forceOpenTooltip={forceOpenTooltip}
          forceOpenMenu={forceOpenMenu}
          forceCopyLinkHover={forceCopyLinkHover}
          demoLink={demoLink}
        />
        <PostContent content={post.content_original} />
        {post.images && post.images.length > 0 && (
          <ImageContent images={post.images} streamId={post.stream_id} />
        )}
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
        nextProps.post?.reaction?.my_reaction &&
      prevProps.post?.images === nextProps.post?.images
    );
  },
);

export default PostCard;
