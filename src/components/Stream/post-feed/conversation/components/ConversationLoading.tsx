import React from "react";
import { useSelector } from "react-redux";
import PostSkeleton from "@/components/Stream/post-feed/loaders/PostSkeleton";
import { selectActiveParentStream } from "@/store/selectors/streamSelectors";

export const ParentSkeleton = React.memo(function ParentSkeleton() {
  const parent = useSelector(selectActiveParentStream);

  if (!parent) return null;

  return (
    <div className="pb-6 border-b border-slate-800/40">
      <PostSkeleton size="md" />
    </div>
  );
});

interface ConversationLoadingProps {
  isReady: boolean;
}

export const ConversationLoading = React.memo(function ConversationLoading({
  isReady,
}: Readonly<ConversationLoadingProps>) {
  return (
    <div
      className={`absolute inset-0 bg-slate-950 z-30 pt-16 pr-2 space-y-6 transition-opacity duration-300 ${
        isReady ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transform: "scaleY(-1)" }}
    >
      <ParentSkeleton />
      <div className="pt-2">
        <div className="h-4 bg-slate-800/40 rounded-md w-28 mb-4 animate-pulse" />
        <div className="space-y-4">
          <PostSkeleton size="xs" />
          <PostSkeleton size="xs" />
        </div>
      </div>
    </div>
  );
});
