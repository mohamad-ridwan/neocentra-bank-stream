import React from "react";
import { CheckCircle } from "lucide-react";
import { useStream } from "./hooks/useStream";
import PostsFeed from "./PostsFeed";
import TrendingSidebar from "./TrendingSidebar";
import QuickStats from "./QuickStats";

export default function Stream() {
  const {
    posts,
    activeConversation,
    activeUser,
    newCommentTexts,
    showComments,
    toastMessage,
    handleLike,
    handleShare,
    toggleComments,
    handleCommentTextChange,
    handleAddComment,
  } = useStream();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-teal-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold z-50 animate-bounce flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Section (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              NeoCentra Stream
            </h1>
            <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-xl">
              User:{" "}
              <span className="text-teal-400 font-semibold">{activeUser}</span>
            </div>
          </div>

          {/* Posts Feed */}
          <PostsFeed
            posts={posts}
            activeConversation={activeConversation}
            showComments={showComments}
            newCommentTexts={newCommentTexts}
            handleLike={handleLike}
            handleShare={handleShare}
            toggleComments={toggleComments}
            handleCommentTextChange={handleCommentTextChange}
            handleAddComment={handleAddComment}
          />
        </div>

        {/* Sidebar / Trending Section (Col-span 1) */}
        <div className="space-y-6">
          <TrendingSidebar />
          <QuickStats />
        </div>
      </div>
    </div>
  );
}
