import React from "react";
import { List } from "react-window";
import { useSelector } from "react-redux";
import { selectStreamsList } from "@/store/selectors/streamSelectors";
import { usePostFeed } from "../hooks/usePostFeed";
import { StreamPost } from "@/types/stream.types";
import PostCard from "./PostCard";
import PostSkeleton from "./loaders/PostSkeleton";

interface RowProps {
  posts: StreamPost[];
}

const Row = React.memo(
  ({
    index,
    style,
    posts,
  }: {
    index: number;
    style: React.CSSProperties;
  } & RowProps) => {
    const post = posts[index];
    if (!post) {
      return (
        <div style={style} className="pb-3">
          <PostSkeleton />
        </div>
      );
    }

    return (
      <div
        style={{
          ...style,
        }}
        className="pb-3"
      >
        <PostCard post={post} />
      </div>
    );
  },
);

Row.displayName = "PostFeedRow";

export default function PostsFeed() {
  const posts = useSelector(selectStreamsList);

  const {
    viewportHeight,
    wrapperRef,
    listRef,
    rowHeight,
    wrapperHeight,
    onRowsRendered,
    isLoading,
  } = usePostFeed({ posts });

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: wrapperHeight, width: "100%" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: viewportHeight,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <List
          listRef={listRef}
          rowCount={isLoading ? posts.length + 2 : posts.length}
          rowHeight={rowHeight}
          rowComponent={Row as any}
          onRowsRendered={onRowsRendered}
          defaultHeight={245}
          rowProps={{ posts }}
          className="scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
          style={{ height: "100%", width: "100%", overflow: "hidden" }}
          overscanCount={3}
        />
      </div>
    </div>
  );
}
