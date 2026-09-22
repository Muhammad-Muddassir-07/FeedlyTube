import React, { useState, useEffect } from 'react';
import { Search, X, Tv, Play, CheckCircle } from 'lucide-react';
import { Video, Channel } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  channels: Channel[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channel: Channel) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  videos,
  channels,
  onSelectVideo,
  onSelectChannel,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedVideos = query.trim()
    ? videos.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.channelTitle.toLowerCase().includes(query.toLowerCase()) ||
          v.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const matchedChannels = query.trim()
    ? channels.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#111317] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="relative p-3.5 border-b border-white/5 flex items-center bg-[#13161B]">
          <Search className="w-5 h-5 text-[#9CA3AF] ml-1 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscriptions, videos, topics..."
            className="flex-1 bg-transparent text-sm text-[#F5F7FA] placeholder-[#9CA3AF] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#9CA3AF]">
              Type to search across {channels.length} subscribed channels and all chronological videos.
            </div>
          ) : (
            <>
              {/* Matched Channels */}
              {matchedChannels.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase px-2 mb-1.5">
                    Channels
                  </h4>
                  <div className="space-y-1">
                    {matchedChannels.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => {
                          onSelectChannel(channel);
                          onClose();
                        }}
                        className="p-2 rounded-xl hover:bg-[#1A1F26] flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={channel.avatar}
                          alt={channel.title}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-[#F5F7FA]">
                              {channel.title}
                            </span>
                            {channel.verified && (
                              <CheckCircle className="w-3 h-3 text-[#06B6D4]" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#9CA3AF]">
                            {channel.videoCount} videos tracked
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Videos */}
              {matchedVideos.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase px-2 mb-1.5">
                    Videos
                  </h4>
                  <div className="space-y-1">
                    {matchedVideos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          onSelectVideo(vid);
                          onClose();
                        }}
                        className="p-2 rounded-xl hover:bg-[#1A1F26] flex items-center gap-3 cursor-pointer"
                      >
                        <div className="relative aspect-video w-20 shrink-0 rounded-md overflow-hidden bg-black/50">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                            {vid.duration}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-[#F5F7FA] line-clamp-1">
                            {vid.title}
                          </h5>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                            {vid.channelTitle} • {vid.relativeTime}
                          </p>
                        </div>
                        <Play className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedChannels.length === 0 && matchedVideos.length === 0 && (
                <div className="py-8 text-center text-xs text-[#9CA3AF]">
                  No subscriptions or videos found matching "{query}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
