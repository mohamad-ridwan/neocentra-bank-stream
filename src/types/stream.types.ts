export interface ReactionDetails {
  reaction: string;
  side: string;
}

export interface ReactionSummary {
  reaction: string;
  total: number;
}

export interface StreamReaction {
  my_reaction: ReactionDetails | null;
  reactions: ReactionSummary[];
  total: number;
}

export interface StreamUser {
  avatar: string;
  fullname: string;
  user_id: number;
  username: string;
  role?: string; // Optional to support existing UI
  isVerified?: boolean; // Optional to support existing UI
}

export interface StreamPost {
  stream_id: number;
  content_original: string;
  created_at: string;
  created_display: string;
  reaction: StreamReaction;
  total_likes: number;
  total_replies: number;
  shares?: number; // Optional to support existing UI
  user: StreamUser;
}

export interface ReplyContent {
  avatar: string;
  content_original: string;
  created: string;
  fullname: string;
  user_id: number;
  username: string;
}

export interface ReplyPost {
  parent_stream_id: number;
  stream_id: number;
  reply_to: number;
  reply_content: ReplyContent;
  content_original: string;
  created_at: string;
  created_display: string;
  reaction: StreamReaction;
  total_likes: number;
  total_replies: number;
  user: StreamUser;
}

export interface StreamState {
  streams: {
    data: {
      pagination: {
        is_last_page: boolean;
        total: number;
      };
      stream: StreamPost[];
    };
    message: string;
  };
  conversations: {
    data: {
      conversation: {
        parent: StreamPost | null;
        replies: ReplyPost[];
      } | null;
      pagination: {
        is_last_page: boolean;
        total: number;
      };
    };
    message: string;
  };
}

export interface MockConversation {
  stream_id: number;
  replies: ReplyPost[];
}
