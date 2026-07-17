import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PostCard from './PostCard';
import { StreamPost } from '@/types/stream.types';

const meta: Meta<typeof PostCard> = {
  title: 'Stream/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="dark p-8 bg-slate-950 min-h-[450px] flex items-start justify-center rounded-xl text-slate-100">
        <div className="w-full max-w-xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const mockPost: StreamPost = {
  stream_id: 1,
  content_original: "Perjalanan investasi Anda dimulai dari sini! NeoCentra Bank kini menghadirkan fitur Wealth Management dengan akses produk reksa dana, obligasi, dan proteksi asuransi terbaik langsung dari genggaman tangan Anda. #InvestasiCerdas #NeoCentraWealth",
  created_at: new Date().toISOString(),
  created_display: "3 hours ago",
  total_likes: 128,
  total_replies: 15,
  reaction: {
    my_reaction: null,
    reactions: [
      { reaction: "like", total: 120 },
      { reaction: "heart", total: 8 }
    ],
    total: 128,
  },
  user: {
    user_id: 101,
    username: "neocentra_official",
    fullname: "NeoCentra Wealth Management",
    avatar: "N",
    role: "Official Investment & Wealth Division",
    isVerified: true,
  },
};

export const Default: Story = {
  args: {
    post: mockPost,
    activeConversation: null,
    showComments: false,
    commentText: "",
    onLike: () => console.log("Like clicked"),
    onShare: () => console.log("Share clicked"),
    onCommentToggle: () => console.log("Comment Toggle clicked"),
    onCommentTextChange: (text: string) => console.log("Comment text changed:", text),
    onAddComment: (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Add comment form submitted");
    },
  },
};
