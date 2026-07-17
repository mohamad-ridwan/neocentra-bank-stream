import React from "react";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { StreamPost } from "@/types/stream.types";
import dynamic from "next/dynamic";

const Tooltip = dynamic(
  () => import("shared_remote/Tooltip").then((m) => m.Tooltip),
  { ssr: false },
);
const TooltipTrigger = dynamic(
  () => import("shared_remote/Tooltip").then((m) => m.TooltipTrigger),
  { ssr: false },
);
const TooltipContent = dynamic(
  () => import("shared_remote/Tooltip").then((m) => m.TooltipContent),
  { ssr: false },
);

const DropdownMenu = dynamic(
  () => import("shared_remote/DropdownMenu").then((m) => m.DropdownMenu),
  { ssr: false },
);
const DropdownMenuTrigger = dynamic(
  () => import("shared_remote/DropdownMenu").then((m) => m.DropdownMenuTrigger),
  { ssr: false },
);
const DropdownMenuContent = dynamic(
  () => import("shared_remote/DropdownMenu").then((m) => m.DropdownMenuContent),
  { ssr: false },
);
const DropdownMenuItem = dynamic(
  () => import("shared_remote/DropdownMenu").then((m) => m.DropdownMenuItem),
  { ssr: false },
);

interface PostHeaderProps {
  post: StreamPost;
}

export default function PostHeader({ post }: Readonly<PostHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
          {post.user.fullname.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white text-sm hover:underline cursor-pointer">
              {post.user.fullname}
            </span>
            {post.user.isVerified && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teal-400 fill-teal-400/20" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="font-bold text-teal-400 text-sm">
                    Verified Account
                  </div>
                  <div className="text-slate-300 mt-0.5 text-xs">
                    NeoCentra Bank sudah mengkonfirmasi keaslian dan kelayakan
                    akun ini
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {post.user.role || "NeoCentra user"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{post.created_display}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-slate-500 hover:text-slate-300 focus:outline-none p-1 rounded-full hover:bg-slate-800/40 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 bg-slate-950 border border-slate-800 p-1 rounded-xl shadow-2xl"
          >
            <DropdownMenuItem
              onClick={() => console.log("Save clicked")}
              className="text-slate-300 focus:text-white hover:bg-slate-800/60 focus:bg-slate-800/60 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors"
            >
              Save
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Follow clicked")}
              className="text-slate-300 focus:text-white hover:bg-slate-800/60 focus:bg-slate-800/60 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors"
            >
              Follow this Post
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Copy Link clicked")}
              className="text-slate-300 focus:text-white hover:bg-slate-800/60 focus:bg-slate-800/60 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors"
            >
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
