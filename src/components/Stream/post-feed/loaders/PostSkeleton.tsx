import React from "react";

interface PostSkeletonProps {
  size?: "xs" | "sm" | "md" | "lg";
}

export default function PostSkeleton({ size = "md" }: Readonly<PostSkeletonProps>) {
  const containerPadding = {
    xs: "p-4",
    sm: "p-4",
    md: "p-6",
    lg: "p-6",
  }[size];

  const avatarSize = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const fullnameSize = {
    xs: "h-3 w-24 mb-1",
    sm: "h-3.5 w-28 mb-2",
    md: "h-4 w-32 mb-2",
    lg: "h-4.5 w-36 mb-2",
  }[size];

  const roleSize = {
    xs: "h-2 w-16",
    sm: "h-2.5 w-16",
    md: "h-3 w-20",
    lg: "h-3.5 w-24",
  }[size];

  const headerMargin = {
    xs: "mb-2",
    sm: "mb-3",
    md: "mb-4",
    lg: "mb-4",
  }[size];

  const contentMargin = {
    xs: "mb-2",
    sm: "mb-3",
    md: "mb-4",
    lg: "mb-4",
  }[size];

  const contentPadding = {
    xs: "pl-8",
    sm: "pl-0",
    md: "pl-0",
    lg: "pl-0",
  }[size];

  const displayActionBar = size !== "xs";

  return (
    <div className={`bg-slate-900/30 border border-slate-800/40 rounded-2xl shadow-xl relative overflow-hidden animate-pulse ${containerPadding}`}>
      {/* Header Skeleton */}
      <div className={`flex items-center justify-between ${headerMargin}`}>
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <div className={`${avatarSize} rounded-full bg-slate-800/60`} />
          <div>
            {/* Fullname Skeleton */}
            <div className={`${fullnameSize} bg-slate-800/60 rounded-md`} />
            {/* Role Skeleton */}
            <div className={`${roleSize} bg-slate-800/60 rounded-md`} />
          </div>
        </div>
        {/* Time and Actions Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-10 bg-slate-800/60 rounded-md" />
          {size !== "xs" && <div className="w-5 h-5 rounded-full bg-slate-800/60" />}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className={`space-y-1.5 ${contentMargin} ${contentPadding}`}>
        <div className="h-3.5 bg-slate-800/60 rounded-md w-full" />
        <div className="h-3.5 bg-slate-800/60 rounded-md w-11/12" />
      </div>

      {/* Action Bar Skeleton */}
      {displayActionBar && (
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-4">
          <div className="h-5 w-16 bg-slate-800/60 rounded-md" />
          <div className="h-5 w-20 bg-slate-800/60 rounded-md" />
          <div className="h-5 w-16 bg-slate-800/60 rounded-md" />
        </div>
      )}
    </div>
  );
}
