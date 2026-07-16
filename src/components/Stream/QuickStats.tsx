import React from "react";
import { MessageCircle } from "lucide-react";

export default function QuickStats() {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl text-xs text-slate-400 leading-relaxed">
      <h3 className="font-bold text-white mb-2 flex items-center gap-1.5">
        <MessageCircle className="w-4 h-4 text-indigo-400" />
        Stream Stats
      </h3>
      <p>
        You are viewing a federated Micro-Frontend component
        (`stream_remote`) hosted at port `3346` and loaded via dynamic CSS
        injection.
      </p>
    </div>
  );
}
