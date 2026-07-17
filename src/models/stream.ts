import { StreamPost, MockConversation } from "@/types/stream.types";

const initialPosts: StreamPost[] = [
  {
    stream_id: 1,
    content_original:
      "Exciting news! NeoCentra Bank just rolled out the new BI-Fast upgrade. Transactions are now faster and have zero fees for transfers to all major local banks. Check it out on the payment tab!",
    created_at: "2026-07-15T14:45:00Z",
    created_display: "Today at 02:45 PM",
    reaction: {
      my_reaction: null,
      reactions: [{ reaction: "👍", total: 10 }],
      total: 10,
    },
    total_likes: 42,
    total_replies: 2,
    shares: 12,
    user: {
      avatar: "",
      fullname: "Sarah Jenkins",
      user_id: 101,
      username: "sarah_j",
      role: "Digital Banking Lead",
      isVerified: true,
    },
  },
  {
    stream_id: 2,
    content_original:
      "Security Alert: NeoCentra Bank will never ask for your password, OTP, or PIN code via phone call, SMS, or chat apps. Keep your credentials secure, and activate 2FA in your account settings.",
    created_at: "2026-07-14T11:20:00Z",
    created_display: "Yesterday at 11:20 AM",
    reaction: {
      my_reaction: null,
      reactions: [{ reaction: "👍", total: 20 }],
      total: 20,
    },
    total_likes: 128,
    total_replies: 1,
    shares: 84,
    user: {
      avatar: "",
      fullname: "NeoCentra Security Team",
      user_id: 102,
      username: "neocentra_sec",
      role: "Cybersecurity & Risk",
      isVerified: true,
    },
  },
  {
    stream_id: 3,
    content_original:
      "Does anyone know if the new cashier cashback program works for international transactions? The promo banner mentions retail spend, but I want to make sure before buying my plane tickets.",
    created_at: "2026-07-13T10:00:00Z",
    created_display: "2 days ago",
    reaction: {
      my_reaction: null,
      reactions: [],
      total: 0,
    },
    total_likes: 8,
    total_replies: 1,
    shares: 1,
    user: {
      avatar: "",
      fullname: "Alex Rivera",
      user_id: 103,
      username: "alex_r",
      role: "NeoCentra customer",
      isVerified: false,
    },
  },
];

// Generate 97 more posts dynamically for a total of 100 data posts
for (let i = 4; i <= 20; i++) {
  initialPosts.push({
    stream_id: i,
    content_original: `This is a generated post #${i} to test scroll performance and react-window virtualization. Here is some random content to make each post length slightly different. ${
      i % 2 === 0 ? "Adding some extra text for even-indexed posts." : ""
    } ${
      i % 3 === 0
        ? "Also, adding even more text to make this post look longer and more realistic in a social feed."
        : ""
    }`,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    created_display: `${i} hours ago`,
    reaction: {
      my_reaction: null,
      reactions: i % 5 === 0 ? [{ reaction: "👍", total: i % 7 }] : [],
      total: i % 5 === 0 ? i % 7 : 0,
    },
    total_likes: i * 3,
    total_replies: 0,
    shares: i * 2,
    user: {
      avatar: "",
      fullname: `Demo User ${i}`,
      user_id: 1000 + i,
      username: `demo_user_${i}`,
      role: i % 2 === 0 ? "Bank Customer" : "Financial Advisor",
      isVerified: i % 4 === 0,
    },
  });
}

export const INITIAL_STREAM_POSTS: StreamPost[] = initialPosts;

export const INITIAL_MOCK_REPLIES: MockConversation[] = [
  {
    stream_id: 1,
    replies: [
      {
        parent_stream_id: 1,
        stream_id: 1001,
        reply_to: 1,
        reply_content: {
          avatar: "",
          content_original:
            "Tried it this morning! Absolutely seamless. Transfer received in less than 2 seconds.",
          created: "1 hour ago",
          fullname: "Devin Carter",
          user_id: 201,
          username: "devin_c",
        },
        content_original:
          "Tried it this morning! Absolutely seamless. Transfer received in less than 2 seconds.",
        created_at: "2026-07-15T15:00:00Z",
        created_display: "1 hour ago",
        reaction: {
          my_reaction: null,
          reactions: [],
          total: 0,
        },
        total_likes: 0,
        total_replies: 0,
        user: {
          avatar: "",
          fullname: "Devin Carter",
          user_id: 201,
          username: "devin_c",
        },
      },
      {
        parent_stream_id: 1,
        stream_id: 1002,
        reply_to: 1,
        reply_content: {
          avatar: "",
          content_original:
            "Awesome, zero fees makes a huge difference for daily transfers.",
          created: "45 mins ago",
          fullname: "Maria Gonzalez",
          user_id: 202,
          username: "maria_g",
        },
        content_original:
          "Awesome, zero fees makes a huge difference for daily transfers.",
        created_at: "2026-07-15T15:15:00Z",
        created_display: "45 mins ago",
        reaction: {
          my_reaction: null,
          reactions: [],
          total: 0,
        },
        total_likes: 0,
        total_replies: 0,
        user: {
          avatar: "",
          fullname: "Maria Gonzalez",
          user_id: 202,
          username: "maria_g",
        },
      },
    ],
  },
  {
    stream_id: 2,
    replies: [
      {
        parent_stream_id: 2,
        stream_id: 2001,
        reply_to: 2,
        reply_content: {
          avatar: "",
          content_original:
            "Thanks for the reminder. Lots of phishing attempts going around lately.",
          created: "Yesterday",
          fullname: "Richard K.",
          user_id: 203,
          username: "richard_k",
        },
        content_original:
          "Thanks for the reminder. Lots of phishing attempts going around lately.",
        created_at: "2026-07-14T12:00:00Z",
        created_display: "Yesterday",
        reaction: {
          my_reaction: null,
          reactions: [],
          total: 0,
        },
        total_likes: 0,
        total_replies: 0,
        user: {
          avatar: "",
          fullname: "Richard K.",
          user_id: 203,
          username: "richard_k",
        },
      },
    ],
  },
  {
    stream_id: 3,
    replies: [
      {
        parent_stream_id: 3,
        stream_id: 3001,
        reply_to: 3,
        reply_content: {
          avatar: "",
          content_original:
            "Hey Alex! Yes, it applies to international retail transactions, but there is a cap of IDR 500k cashback per customer. You can check the Terms & Conditions page under promotions.",
          created: "1 day ago",
          fullname: "Sarah Jenkins",
          user_id: 101,
          username: "sarah_j",
        },
        content_original:
          "Hey Alex! Yes, it applies to international retail transactions, but there is a cap of IDR 500k cashback per customer. You can check the Terms & Conditions page under promotions.",
        created_at: "2026-07-14T10:00:00Z",
        created_display: "1 day ago",
        reaction: {
          my_reaction: null,
          reactions: [],
          total: 0,
        },
        total_likes: 0,
        total_replies: 0,
        user: {
          avatar: "",
          fullname: "Sarah Jenkins",
          user_id: 101,
          username: "sarah_j",
        },
      },
    ],
  },
];
