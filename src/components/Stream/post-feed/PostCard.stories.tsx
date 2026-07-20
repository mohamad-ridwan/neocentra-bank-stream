import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { toast } from "sonner";
import { useArgs } from "storybook/internal/preview-api";
import PostCard from "./PostCard";
import { StreamPost } from "@/types/stream.types";
import MfeProviders from "../../MfeProviders";

const meta: Meta<typeof PostCard> = {
  title: "Stream/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MfeProviders>
        <div className="dark p-8 bg-slate-950 min-h-[450px] flex items-start justify-center rounded-xl text-slate-100">
          <div className="w-full max-w-xl">
            <Story />
          </div>
        </div>
      </MfeProviders>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const mockPost: StreamPost = {
  stream_id: 1,
  content_original:
    "Perjalanan investasi Anda dimulai dari sini! NeoCentra Bank kini menghadirkan fitur Wealth Management dengan akses produk reksa dana, obligasi, dan proteksi asuransi terbaik langsung dari genggaman tangan Anda. #InvestasiCerdas #NeoCentraWealth",
  created_at: new Date().toISOString(),
  created_display: "3 hours ago",
  total_likes: 128,
  total_replies: 15,
  reaction: {
    my_reaction: null,
    reactions: [
      { reaction: "like", total: 120 },
      { reaction: "heart", total: 8 },
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
    onCommentTextChange: (text: string) =>
      console.log("Comment text changed:", text),
    onAddComment: (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Add comment form submitted");
    },
  },
};

const ExpandedStoryWrapper = ({
  hasAccountVerified,
  hoverVerifiedAccount,
  clickMenu,
  clickCopyLink,
  hoverLikeIcon,
  hoverCommentIcon,
  post,
  updateArgs,
  ...props
}: React.ComponentProps<typeof PostCard> & {
  hasAccountVerified?: boolean;
  hoverVerifiedAccount?: boolean;
  clickMenu?: boolean;
  clickCopyLink?: boolean;
  hoverLikeIcon?: boolean;
  hoverCommentIcon?: boolean;
  updateArgs: (args: any) => void;
}) => {
  const [localClickMenu, setLocalClickMenu] = React.useState(clickMenu);
  const [localCopyLinkHover, setLocalCopyLinkHover] = React.useState(false);

  // Sync clickMenu from props to local state
  React.useEffect(() => {
    setLocalClickMenu(clickMenu);
  }, [clickMenu]);

  React.useEffect(() => {
    if (clickCopyLink) {
      setLocalCopyLinkHover(true);
      const timer = setTimeout(() => {
        toast.success("Link copied");
        setLocalCopyLinkHover(false);
        updateArgs({ clickMenu: false, clickCopyLink: false });
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setLocalCopyLinkHover(false);
    }
  }, [clickCopyLink, updateArgs]);

  const modifiedPost = React.useMemo(() => {
    return {
      ...post,
      user: {
        ...post.user,
        isVerified: !!hasAccountVerified,
      },
    };
  }, [post, hasAccountVerified]);

  return (
    <PostCard
      {...props}
      post={modifiedPost}
      forceOpenTooltip={hoverVerifiedAccount}
      forceOpenMenu={localClickMenu}
      forceCopyLinkHover={localCopyLinkHover}
      forceHoverLike={hoverLikeIcon}
      forceHoverComment={hoverCommentIcon}
      demoLink="https://neocentra.bank/stream/post/1-demo-copy"
    />
  );
};

export const Expanded: StoryObj<
  React.ComponentProps<typeof PostCard> & {
    hasAccountVerified?: boolean;
    hoverVerifiedAccount?: boolean;
    clickMenu?: boolean;
    clickCopyLink?: boolean;
    hoverLikeIcon?: boolean;
    hoverCommentIcon?: boolean;
  }
> = {
  args: {
    post: mockPost,
    activeConversation: null,
    showComments: false,
    commentText: "",
    onLike: () => console.log("Like clicked"),
    onShare: () => console.log("Share clicked"),
    onCommentToggle: () => console.log("Comment Toggle clicked"),
    onCommentTextChange: (text: string) =>
      console.log("Comment text changed:", text),
    onAddComment: (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Add comment form submitted");
    },
    hasAccountVerified: true,
    hoverVerifiedAccount: false,
    clickMenu: false,
    clickCopyLink: false,
    hoverLikeIcon: false,
    hoverCommentIcon: false,
  },
  argTypes: {
    hasAccountVerified: {
      control: "boolean",
      description: "Toggle icon akun terverifikasi",
    },
    hoverVerifiedAccount: {
      control: "boolean",
      description: "Toggle menampilkan tooltip verified account",
      if: { arg: "hasAccountVerified", eq: true },
    },
    clickMenu: {
      control: "boolean",
      description: "Toggle menampilkan dropdown menu",
    },
    clickCopyLink: {
      control: "boolean",
      description:
        "Trigger click button Copy Link di dropdown menu dan menampilkan toast sukses",
      if: { arg: "clickMenu", eq: true },
    },
    hoverLikeIcon: {
      control: "boolean",
      description: "Toggle hover active icon like",
    },
    hoverCommentIcon: {
      control: "boolean",
      description: "Toggle hover active icon komentar",
    },
  },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    return <ExpandedStoryWrapper {...(currentArgs as any)} updateArgs={updateArgs} />;
  },
};
