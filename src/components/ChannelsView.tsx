import React, { useState, useMemo } from 'react';
import { Search, Bell, BellOff, MoreVertical, RotateCw, Star, CheckCircle, ArrowUpDown, ExternalLink, X } from 'lucide-react';
import { Channel, Video } from '../types';
import { VideoCard } from './VideoCard';

interface ChannelsViewProps {
  channels: Channel[];
  videos: Video[];
  onToggleFavorite: (channelId: string) => void;
  onToggleMute: (channelId: string) => void;
  onSyncChannels: () => void;
  isSyncing: boolean;
  onSelectVideo: (video: Video) => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  channels,
  videos,
  onToggleFavorite,
  onToggleMute,
  onSyncChannels,
  isSyncing,
  onSelectVideo,
  onToggleSave,
  onToggleWatched,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'muted'>('all');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const favoritesCount = useMemo(() => channels.filter((c) => c.isFavorite).length, [channels]);
  const mutedCount = useMemo(() => channels.filter((c) => c.isMuted).length, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesSearch =
        channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === 'favorites') return channel.isFavorite;
      if (filterType === 'muted') return channel.isMuted;
      return true;
    });
  }, [channels, searchQuery, filterType]);

  const channelVideos = useMemo(() => {
    if (!selectedChannel) return [];
    return videos.filter((v) => v.channelId === selectedChannel.id);
  }, [videos, selectedChannel]);

  return (
    <div id="channels-view-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-32">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            id="channels-filter-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${channels.length} channels...`}
            className="w-full pl-10 pr-4 py-2.5 bg-[#13161B] border border-white/5 focus:border-[#6366F1]/50 rounded-xl text-sm text-[#e2e2e6] placeholder-[#9CA3AF] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            // cycle filter
            if (filterType === 'all') setFilterType('favorites');
            else if (filterType === 'favorites') setFilterType('muted');
            else setFilterType('all');
          }}
          className="p-2.5 bg-[#13161B] hover:bg-[#1A1F26] border border-white/5 rounded-xl text-[#9CA3AF] hover:text-white cursor-pointer"
          title="Toggle views"
        >
          <ArrowUpDown className="w-4 h-4 text-[#06B6D4]" />
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="channels-tab-all"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            filterType === 'all'
              ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
              : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
          }`}
        >
          All Channels {channels.length}
        </button>

        <button
          id="channels-tab-favorites"
          onClick={() => setFilterType('favorites')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            filterType === 'favorites'
              ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
              : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
          }`}
        >
          Favorites {favoritesCount}
        </button>

        <button
          id="channels-tab-muted"
          onClick={() => setFilterType('muted')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            filterType === 'muted'
              ? 'bg-[#6366F1]/20 text-[#c0c1ff] border border-[#6366F1]/50'
              : 'bg-[#13161B] text-[#9CA3AF] hover:text-[#e2e2e6] border border-white/5'
          }`}
        >
          Muted / Inactive {mutedCount}
        </button>
      </div>

      {/* Channel Item List */}
      <div className="space-y-2.5">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            id={`channel-item-${channel.id}`}
            onClick={() => setSelectedChannel(channel)}
            className="group relative bg-[#13161B] hover:bg-[#1A1F26] border border-white/5 hover:border-[#6366F1]/30 rounded-xl p-3.5 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* Channel Avatar with cyan unread badge */}
              <div className="relative shrink-0">
                <img
                  src={channel.avatar}
                  alt={channel.title}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10"
                />
                {channel.unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#06B6D4] border-2 border-[#13161B] rounded-full"
                    title={`${channel.unreadCount} unread videos`}
                  />
                )}
              </div>

              {/* Channel Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-[#F5F7FA] truncate group-hover:text-[#c0c1ff]">
                    {channel.title}
                  </h3>
                  {channel.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                  )}
                </div>

                <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                  {channel.videoCount} videos tracked • {channel.description}
                </p>

                {/* Status Badges Row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[11px] text-[#9CA3AF]">
                    Latest: {channel.latestVideoTime}
                  </span>

                  {channel.unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#6366F1]/15 border border-[#6366F1]/30 text-[11px] font-medium text-[#c0c1ff]">
                      {channel.unreadCount} unread
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-[#9CA3AF]">
                      Caught up
                    </span>
                  )}

                  <span className="text-[11px] text-[#06B6D4] font-medium flex items-center gap-1 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                    {channel.isMuted ? 'Muted' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Bell + 3 dots) */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleFavorite(channel.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    channel.isFavorite
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-[#9CA3AF] hover:text-[#e2e2e6] hover:bg-white/5'
                  }`}
                  title={channel.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                >
                  <Star className={`w-4 h-4 ${channel.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onToggleMute(channel.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    channel.isMuted
                      ? 'text-rose-400 bg-rose-400/10'
                      : 'text-[#9CA3AF] hover:text-[#e2e2e6] hover:bg-white/5'
                  }`}
                  title={channel.isMuted ? 'Unmute Channel' : 'Mute Channel'}
                >
                  {channel.isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === channel.id ? null : channel.id)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#e2e2e6] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === channel.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                      <div className="absolute right-0 top-7 z-50 w-44 py-1 bg-[#1A1F26] border border-white/10 rounded-xl shadow-xl text-xs">
                        <button
                          onClick={() => {
                            setSelectedChannel(channel);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-white/5 text-[#e2e2e6]"
                        >
                          View Channel Feed
                        </button>
                        <button
                          onClick={() => {
                            onToggleMute(channel.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-white/5 text-[#e2e2e6]"
                        >
                          {channel.isMuted ? 'Unmute Channel' : 'Mute Channel'}
                        </button>
                        <a
                          href={`https://youtube.com/${channel.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3 py-2 text-left hover:bg-white/5 text-[#9CA3AF] flex items-center gap-1.5 border-t border-white/5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>YouTube Profile</span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Floating Bar (Matching Image 10 bottom status) */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-4 pointer-events-none">
        <div className="max-w-2xl mx-auto bg-[#13161B]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-[#F5F7FA]">
                {channels.length} YouTube channels connected
              </p>
              <p className="text-[11px] text-[#9CA3AF]">
                Deterministic RSS feed • Auto-synced 5m ago
              </p>
            </div>
          </div>

          <button
            id="channels-sync-now-btn"
            onClick={onSyncChannels}
            disabled={isSyncing}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1F26] hover:bg-white/10 text-[#06B6D4] border border-[#06B6D4]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Selected Channel Drawer / Detail Modal */}
      {selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#111317] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#13161B]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChannel.avatar}
                  alt={selectedChannel.title}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-[#F5F7FA]">
                      {selectedChannel.title}
                    </h2>
                    {selectedChannel.verified && (
                      <CheckCircle className="w-4 h-4 text-[#06B6D4]" />
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    {selectedChannel.handle} • {selectedChannel.subscriberCount || 'Subscribed'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChannel(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: Chronological videos from only this channel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 bg-[#1A1F26] rounded-xl border border-white/5 text-xs text-[#9CA3AF] flex items-center justify-between">
                <span>Displaying chronological uploads exclusively from {selectedChannel.title}</span>
                <span className="text-[#06B6D4] font-medium">{channelVideos.length} videos</span>
              </div>

              {channelVideos.length > 0 ? (
                channelVideos.map((vid) => (
                  <VideoCard
                    key={vid.id}
                    video={vid}
                    onSelectVideo={(v) => {
                      setSelectedChannel(null);
                      onSelectVideo(v);
                    }}
                    onToggleSave={onToggleSave}
                    onToggleWatched={onToggleWatched}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-xs text-[#9CA3AF]">
                  No cached videos for this channel in current timeline. Click sync to retrieve latest uploads.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
