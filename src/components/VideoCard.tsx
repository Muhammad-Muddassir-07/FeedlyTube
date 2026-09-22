import React, { useState } from 'react';
import { Bookmark, MoreVertical, Check, FolderPlus, ExternalLink, Eye, EyeOff, VolumeX } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
  onAddToFolder?: (videoId: string) => void;
  onMuteChannel?: (channelId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelectVideo,
  onToggleSave,
  onToggleWatched,
  onAddToFolder,
  onMuteChannel,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getBadgeStyle = () => {
    if (video.badgeLabel?.includes('In Progress')) {
      return 'bg-purple-900/80 text-purple-200 border-purple-500/30';
    }
    if (video.badgeLabel === 'NEW') {
      return 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40';
    }
    if (video.badgeLabel?.includes('Deep Work')) {
      return 'bg-amber-950/80 text-amber-200 border-amber-500/30';
    }
    return 'bg-black/70 text-gray-200 border-white/10';
  };

  return (
    <article
      id={`video-card-${video.id}`}
      className="group relative bg-[#13161B] hover:bg-[#1A1F26] border border-white/5 hover:border-[#6366F1]/30 rounded-xl overflow-hidden transition-all duration-200"
    >
      {/* Thumbnail Container */}
      <div
        onClick={() => onSelectVideo(video)}
        className="relative aspect-video w-full overflow-hidden bg-[#1E2023] cursor-pointer"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Top-Left Status Badge */}
        {video.badgeLabel && (
          <div
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide backdrop-blur-md border ${getBadgeStyle()} flex items-center gap-1.5 shadow-sm`}
          >
            {video.badgeLabel === 'NEW' && <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />}
            {video.badgeLabel}
          </div>
        )}

        {/* Bottom-Right Duration */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[11px] font-medium text-white tracking-wide">
          {video.duration}
        </div>

        {/* Watch Progress Bar */}
        {video.watchProgressPercent && video.watchProgressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[#6366F1]"
              style={{ width: `${video.watchProgressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info Section */}
      <div className="p-3.5 flex items-start gap-3">
        {/* Channel Avatar */}
        <button
          onClick={() => onSelectVideo(video)}
          className="shrink-0 relative mt-0.5 focus:outline-none"
          title={video.channelTitle}
        >
          <img
            src={video.channelAvatar}
            alt={video.channelTitle}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
          />
          {video.channelVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#6366F1] rounded-full flex items-center justify-center text-[8px] text-white">
              ✓
            </span>
          )}
        </button>

        {/* Title & Metadata */}
        <div className="flex-1 min-w-0">
          <h3
            onClick={() => onSelectVideo(video)}
            className="text-[14.5px] font-semibold text-[#F5F7FA] leading-snug line-clamp-2 cursor-pointer hover:text-[#c0c1ff] transition-colors"
          >
            {video.title}
          </h3>

          <div className="flex items-center flex-wrap gap-1.5 mt-1.5 text-xs text-[#9CA3AF]">
            <span className="font-medium text-[#e2e2e6] hover:underline cursor-pointer">
              {video.channelTitle}
            </span>
            {video.channelVerified && (
              <span className="text-[#06B6D4] text-[11px]">✓</span>
            )}
            <span>•</span>
            <span>{video.relativeTime}</span>
            {!video.isWatched && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" title="Unread in feed" />
            )}
          </div>
        </div>

        {/* Actions (Bookmark + Menu) */}
        <div className="flex items-center gap-1 shrink-0 relative">
          <button
            id={`bookmark-btn-${video.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(video.id);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              video.isSaved
                ? 'text-[#6366F1] bg-[#6366F1]/10'
                : 'text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-white/5'
            }`}
            title={video.isSaved ? 'Remove from Queue' : 'Save to Watch Later'}
          >
            <Bookmark className={`w-4 h-4 ${video.isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            id={`menu-btn-${video.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Dropdown */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-8 z-50 w-52 py-1.5 bg-[#1A1F26] border border-white/10 rounded-xl shadow-xl backdrop-blur-md text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatched(video.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-[#e2e2e6] hover:bg-white/5 cursor-pointer"
                >
                  {video.isWatched ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>Mark as Unwatched</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>Mark as Watched</span>
                    </>
                  )}
                </button>

                {onAddToFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToFolder(video.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-[#e2e2e6] hover:bg-white/5 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>Add to Collection</span>
                  </button>
                )}

                {onMuteChannel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMuteChannel(video.channelId);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-[#e2e2e6] hover:bg-white/5 cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>Mute Channel</span>
                  </button>
                )}

                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-[#9CA3AF] hover:text-[#e2e2e6] hover:bg-white/5 border-t border-white/5 mt-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on YouTube</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
