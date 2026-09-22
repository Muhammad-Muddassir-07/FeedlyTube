import React from 'react';
import { Search } from 'lucide-react';
import { FeedlyLogo } from './FeedlyLogo';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  currentTab: string;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  currentTab,
  onOpenSearch,
  onOpenSettings,
  onLogoClick,
}) => {
  const getSubtext = () => {
    switch (currentTab) {
      case 'channels':
        return 'Subscriptions';
      case 'queue':
        return 'Watch Later';
      case 'folders':
        return 'Collections';
      case 'settings':
        return 'Settings & Sync';
      default:
        return 'Your Feed';
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full bg-[#111317]/95 backdrop-blur-md border-b border-white/5 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand + Section + Unread Pill */}
        <div className="flex items-center gap-2.5">
          <FeedlyLogo size="sm" onClick={onLogoClick} />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs text-[#9CA3AF] font-medium tracking-wide">
              {getSubtext()}
            </span>
            {unreadCount > 0 && (
              <span
                id="header-unread-badge"
                className="px-1.5 py-0.5 text-[11px] font-semibold tracking-tight text-[#06B6D4] bg-[#06B6D4]/15 rounded-full border border-[#06B6D4]/30"
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Right: Search & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2 text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Search Feed"
            title="Search (⌘K)"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            id="header-avatar-btn"
            onClick={onOpenSettings}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 cursor-pointer"
            aria-label="User Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 hover:ring-[#6366F1]/60 transition-all"
            />
            {user.isGoogleConnected && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#111317]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
