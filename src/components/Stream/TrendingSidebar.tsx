import React from "react";
import { TrendingUp } from "lucide-react";

export default function TrendingSidebar() {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
          <TrendingUp className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Trending Topics
          </h2>
          <p className="text-xs text-slate-400">Real-time banking buzz</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-all cursor-pointer group">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Promo & Cashback
          </div>
          <div className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
            #NeoCentraCashback
          </div>
          <div className="text-xs text-slate-400 mt-1">
            12.4k posts this week
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-all cursor-pointer group">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Payments
          </div>
          <div className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
            #BIFastUpgrade
          </div>
          <div className="text-xs text-slate-400 mt-1">8.2k posts</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-all cursor-pointer group">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Security
          </div>
          <div className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
            #SafeBankingEveryday
          </div>
          <div className="text-xs text-slate-400 mt-1">15.1k posts</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-all cursor-pointer group">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Accounts
          </div>
          <div className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
            #ZeroFeesPromo
          </div>
          <div className="text-xs text-slate-400 mt-1">4.6k posts</div>
        </div>
      </div>
    </div>
  );
}
