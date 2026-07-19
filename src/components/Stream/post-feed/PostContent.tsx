import React from "react";

interface PostContentProps {
  content: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PostContent({
  content,
  size = "md",
  className = "",
}: PostContentProps) {
  const sizeClasses = {
    sm: "text-slate-300 text-xs leading-relaxed",
    md: "text-slate-300 text-sm leading-relaxed mb-6",
    lg: "text-slate-200 text-base leading-relaxed",
  }[size];

  return (
    <div className={`${sizeClasses} ${className}`}>
      {content}
    </div>
  );
}
