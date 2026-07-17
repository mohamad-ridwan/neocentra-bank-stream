import React from "react";

export default function PostSkeleton() {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <div className="w-10 h-10 rounded-full bg-slate-800/60" />
          <div>
            {/* Fullname Skeleton */}
            <div className="h-4 w-32 bg-slate-800/60 rounded-md mb-2" />
            {/* Role Skeleton */}
            <div className="h-3 w-20 bg-slate-800/60 rounded-md" />
          </div>
        </div>
        {/* Time and Actions Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 bg-slate-800/60 rounded-md" />
          <div className="w-5 h-5 rounded-full bg-slate-800/60" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-800/60 rounded-md w-full" />
        <div className="h-4 bg-slate-800/60 rounded-md w-11/12" />
        <div className="h-4 bg-slate-800/60 rounded-md w-9/12" />
      </div>

      {/* Action Bar Skeleton */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-4">
        <div className="h-5 w-16 bg-slate-800/60 rounded-md" />
        <div className="h-5 w-20 bg-slate-800/60 rounded-md" />
        <div className="h-5 w-16 bg-slate-800/60 rounded-md" />
      </div>
    </div>
  );
}
