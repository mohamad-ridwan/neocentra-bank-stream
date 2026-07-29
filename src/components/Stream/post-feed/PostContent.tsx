import React, { memo } from "react";

interface PostContentProps {
  content: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  isScrollable?: boolean;
  scrollAuto?: boolean;
}

const PostContent = memo(
  ({
    content,
    size = "md",
    className = "",
    isScrollable = false,
    scrollAuto = false,
  }: Readonly<PostContentProps>) => {
    const sizeClasses = {
      xs: "text-slate-300 text-xs leading-relaxed",
      sm: "text-slate-300 text-xs leading-relaxed",
      md: "text-slate-300 text-sm leading-relaxed mb-6",
      lg: "text-slate-200 text-base leading-relaxed",
    }[size];

    const canScroll = isScrollable || scrollAuto;
    const scrollClasses = canScroll ? "max-h-[100px] overflow-y-auto" : "";

    return (
      <div className={`${sizeClasses} ${scrollClasses} ${className}`}>
        {content}
      </div>
    );
  },
);

export default PostContent;
