import React, { useState, useMemo } from 'react';
import { RotateCw, Clock, ArrowUpDown, ShieldCheck, ArrowUp, SlidersHorizontal } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { Video } from '../types';

interface FeedViewProps {
  videos: Video[];
  channelCount: number;
  lastSynced: string;
  isSyncing: boolean;
  onRefresh: () => void;
  onSelectVideo: (video: Video) => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
  onNavigateToChannels: () => void;
  onAddToFolder?: (videoId: string) => void;
  onMuteChannel?: (channelId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  videos,
  channelCount,
  lastSynced,
  isSyncing,
  onRefresh,
  onSelectVideo,
  onToggleSave,
  onToggleWatched,
  onNavigateToChannels,
  onAddToFolder,
  onMuteChannel,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    videos.forEach((v) => cats.add(v.category));
    return Array.from(cats);
  }, [videos]);

  const unwatchedCount = useMemo(
    () => videos.filter((v) => !v.isWatched).length,
    [videos]
  );

  // Filtered & Sorted videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (activeFilter === 'unwatched') {
      result = result.filter((v) => !v.isWatched);
    } else if (activeFilter !== 'all') {
      result = result.filter((v) => v.category === activeFilter);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else if (sortBy === 'duration') {
      result.sort((a, b) => b.durationSeconds - a.durationSeconds);
    }

    return result;
  }, [videos, activeFilter, sortBy]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="feed-view-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-28">
      {/* Title & Chronological Meta Bar */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
            Your Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
            <span className="text-[#06B6D4] font-medium">Chronological</span>
            <span>•</span>
            <span>{unwatchedCount} new updates today</span>
          </p>
        </div>

        {/* Sync Status Button */}
        <button
          id="feed-sync-button"
          onClick={onRefresh}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#13161B] hover:bg-[#1A1F26] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5 transition-all cursor-pointer"
          title="Refresh subscription feed"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          <span>Up to date • {lastSynced}</span>
          <RotateCw className={`w-3.5 h-3.5 ml-0.5 text-[#06B6D4] ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Subhead Row: Deterministic Timeline & Sort selector */}
      <div className="flex items-center justify-between text-xs text-[#9CA3AF] font-mono tracking-wider uppercase mb-3.5">
        <div className="flex items-center gap-1.5 text-[#06B6D4]">
          <Clock className="w-3.5 h-3.5" />
          <span>Deterministic Timeline</span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1 text-[#e2e2e6] hover:text-[#c0c1ff] font-sans font-medium capitalize text-xs cursor-pointer"
          >
            <span>{sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : 'Longest First'}</span>
            <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
          </button>

          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-6 z-50 w-36 py-1 bg-[#1A1F26] border border-white/10 rounded-lg shadow-xl text-xs font-sans normal-case">
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-white/5 cursor-pointer ${
                    sortBy === 'newest' ? 'text-[#6366F1] font-semibold' : 'text-[#e2e2e6]'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortBy('oldest');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-white/5 cursor-pointer ${
                    sortBy === 'oldest' ? 'text-[#6366F1] font-semibold' : 'text-[#e2e2e6]'
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => {
                    setSortBy('duration');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-white/5 cursor-pointer ${
                    sortBy === 'duration' ? 'text-[#6366F1] font-semibold' : 'text-[#e2e2e6]'
                  }`}
                >
                  Duration (Longest)
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
              : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
          }`}
        >
          All {videos.length}
        </button>

        <button
          onClick={() => setActiveFilter('unwatched')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeFilter === 'unwatched'
              ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
              : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
          }`}
        >
          Unwatched {unwatchedCount}
        </button>

        {categories.map((cat) => {
          const count = videos.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
                  : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
              }`}
            >
              {cat} {count}
            </button>
          );
        })}
      </div>

      {/* Video Feed Cards List */}
      <div className="space-y-4">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelectVideo={onSelectVideo}
            onToggleSave={onToggleSave}
            onToggleWatched={onToggleWatched}
            onAddToFolder={onAddToFolder}
            onMuteChannel={onMuteChannel}
          />
        ))}

        {filteredVideos.length === 0 && (
          <div className="py-16 text-center bg-[#13161B] border border-white/5 rounded-2xl p-8">
            <p className="text-sm font-medium text-[#e2e2e6]">No videos match this filter</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Try switching back to 'All' or checking your subscriptions.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#6366F1] text-white hover:bg-[#4F46E5] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* End of Feed: "You're all caught up!" */}
      {filteredVideos.length > 0 && (
        <div className="mt-8 p-6 bg-[#13161B]/80 border border-white/5 rounded-2xl text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h3 className="text-base font-semibold text-[#F5F7FA]">
            You're all caught up!
          </h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mt-1 leading-relaxed">
            Subscriptions evaluated across {channelCount} channels • 0 algorithmic interruptions • Pure chronological sanity.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              id="feed-manage-channels-btn"
              onClick={onNavigateToChannels}
              className="px-4 py-2 text-xs font-medium text-[#e2e2e6] bg-[#1A1F26] hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Manage {channelCount} Channels</span>
            </button>

            <button
              id="scroll-to-top-btn"
              onClick={scrollToTop}
              className="p-2 text-[#9CA3AF] hover:text-white bg-[#1A1F26] hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
