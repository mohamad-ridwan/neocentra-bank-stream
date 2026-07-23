import React, { memo, useCallback } from "react";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { StreamUser } from "@/types/stream.types";
import dynamic from "next/dynamic";
import { handleCopyLink } from "@/helpers/copies";

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
  post: StreamUser & { created_display?: string; stream_id?: number };
  demoLink?: string;
  forceOpenTooltip?: boolean;
  forceOpenMenu?: boolean;
  forceCopyLinkHover?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  hideMenu?: boolean;
}

const PostHeader = memo(
  ({
    post,
    demoLink,
    forceOpenTooltip,
    forceOpenMenu,
    forceCopyLinkHover,
    size = "md",
    hideMenu = false,
  }: Readonly<PostHeaderProps>) => {
    const avatarSize = {
      xs: "w-6 h-6 text-[10px]",
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base font-extrabold",
    }[size];

    const nameSize = {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    }[size];

    const checkCircleSize = {
      xs: "w-3 h-3",
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    }[size];

    const roleSize = {
      xs: "text-[9px]",
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-xs",
    }[size];

    const dateSize = {
      xs: "text-[9px]",
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-xs",
    }[size];

    const gapSize = {
      xs: "gap-2",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    }[size];

    const avatarGradient =
      size === "xs"
        ? "from-indigo-500 to-purple-500"
        : "from-teal-500 to-indigo-500";

    const nameColor =
      size === "xs"
        ? "text-teal-400 font-bold"
        : "font-bold text-white hover:underline cursor-pointer";

    const copyLink = useCallback(() => {
      if (post?.stream_id) handleCopyLink(post.stream_id, demoLink);
    }, [post.stream_id, demoLink]);

    return (
      <div
        className={`flex items-center justify-between ${size === "lg" ? "w-full" : size === "xs" ? "mb-2" : "mb-4"}`}
      >
        <div className={`flex items-center ${gapSize}`}>
          <div
            className={`rounded-full bg-gradient-to-br flex items-center justify-center text-slate-950 font-bold shadow-md ${avatarGradient} ${avatarSize}`}
          >
            {post.fullname.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`${nameColor} ${nameSize}`}>
                {post.fullname}
              </span>
              {post.isVerified && size !== "xs" && (
                <Tooltip
                  {...(forceOpenTooltip !== undefined
                    ? { open: forceOpenTooltip }
                    : {})}
                >
                  <TooltipTrigger asChild>
                    <span className="flex items-center">
                      <CheckCircle
                        className={`text-teal-400 fill-teal-400/20 ${checkCircleSize}`}
                      />
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
            {size !== "xs" && (
              <p className={`text-slate-400 ${roleSize}`}>
                {post.role || "NeoCentra user"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-slate-500 ${dateSize}`}>
            {post.created_display}
          </span>
          {!hideMenu && (
            <DropdownMenu
              {...(forceOpenMenu !== undefined ? { open: forceOpenMenu } : {})}
            >
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
                  onClick={copyLink}
                  className={`text-slate-300 focus:text-white hover:bg-slate-800/60 focus:bg-slate-800/60 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors ${
                    forceCopyLinkHover ? "bg-slate-800/60 text-white" : ""
                  }`}
                >
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  },
);

export default PostHeader;
