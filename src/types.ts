export interface Chapter {
  time: string;
  seconds: number;
  title: string;
}

export interface Video {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  channelTitle: string;
  channelAvatar: string;
  channelVerified: boolean;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  relativeTime: string;
  duration: string;
  durationSeconds: number;
  youtubeUrl: string;
  embeddable: boolean;
  isWatched: boolean;
  watchProgressSeconds?: number;
  watchProgressPercent?: number;
  isSaved: boolean; // Saved to Watch Later
  isNew?: boolean;
  badgeLabel?: string;
  category: string;
  views?: string;
  chapters?: Chapter[];
  tags?: string[];
}

export interface Channel {
  id: string;
  youtubeChannelId: string;
  title: string;
  handle: string;
  description: string;
  avatar: string;
  banner?: string;
  videoCount: number;
  subscriberCount?: string;
  category: string;
  latestVideoTime: string;
  unreadCount: number;
  isFavorite: boolean;
  isMuted: boolean;
  isActive: boolean;
  verified: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  createdAt: string;
  color?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGoogleConnected: boolean;
  googleAccountId?: string;
  connectedAt?: string;
  lastSyncedAt: string;
  channelCount: number;
  plan: 'free' | 'supporter' | 'pro';
}

export type TabType = 'feed' | 'channels' | 'queue' | 'folders' | 'settings';
