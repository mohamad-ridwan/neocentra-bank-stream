import React, { memo } from "react";

interface PostContentProps {
  content: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const PostContent = memo(
  ({ content, size = "md", className = "" }: Readonly<PostContentProps>) => {
    const sizeClasses = {
      xs: "text-slate-300 text-xs leading-relaxed",
      sm: "text-slate-300 text-xs leading-relaxed",
      md: "text-slate-300 text-sm leading-relaxed mb-6",
      lg: "text-slate-200 text-base leading-relaxed",
    }[size];

    return <div className={`${sizeClasses} ${className}`}>{content}</div>;
  },
);

export default PostContent;
