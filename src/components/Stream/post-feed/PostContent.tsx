import React from "react";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="text-slate-300 text-sm leading-relaxed mb-6">
      {content}
    </div>
  );
}
