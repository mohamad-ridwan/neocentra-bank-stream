import React from "react";
import { useSelector } from "react-redux";
import PostsFeed from "./post-feed";
import TrendingSidebar from "./trending-topic";
import QuickStats from "./QuickStats";

export default function Stream() {
  const auth = useSelector((state: any) => state.auth);
  const activeUser = auth?.user?.username || "Guest User";

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main Feed Section (Left Side) */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              NeoCentra Stream
            </h1>
            <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-xl">
              User:{" "}
              <span className="text-teal-400 font-semibold">{activeUser}</span>
            </div>
          </div>

          <PostsFeed />
        </div>

        {/* Sidebar / Trending & Stream Stats (Right Side) */}
        <div className="hidden md:!block md:w-80 lg:w-[350px] shrink-0 space-y-6">
          <TrendingSidebar />
          <QuickStats />
        </div>
      </div>
    </div>
  );
}
