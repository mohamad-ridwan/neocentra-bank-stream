import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PostHeader from './PostHeader';
import { StreamPost } from '@/types/stream.types';

const meta: Meta<typeof PostHeader> = {
  title: 'Stream/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="dark p-8 bg-slate-950 min-h-[350px] flex items-start justify-center rounded-xl text-slate-100">
        <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostHeader>;

const mockVerifiedPost: StreamPost = {
  stream_id: 1,
  content_original: "Menyambut masa depan perbankan digital dengan NeoCentra Bank. Keamanan dan kenyamanan Anda adalah prioritas kami.",
  created_at: new Date().toISOString(),
  created_display: "2 hours ago",
  total_likes: 24,
  total_replies: 5,
  reaction: {
    my_reaction: null,
    reactions: [],
    total: 0,
  },
  user: {
    user_id: 101,
    username: "neocentra_official",
    fullname: "NeoCentra Official",
    avatar: "N",
    role: "Official Bank Account",
    isVerified: true,
  },
};

const mockUnverifiedPost: StreamPost = {
  ...mockVerifiedPost,
  stream_id: 2,
  user: {
    ...mockVerifiedPost.user,
    fullname: "Budi Santoso",
    role: "Retail Customer",
    isVerified: false,
  },
};

export const VerifiedUser: Story = {
  args: {
    post: mockVerifiedPost,
  },
};

export const UnverifiedUser: Story = {
  args: {
    post: mockUnverifiedPost,
  },
};
