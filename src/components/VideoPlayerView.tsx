import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Bookmark,
  Check,
  CheckCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Lock,
  ExternalLink,
  SlidersHorizontal,
  Bell,
  BellOff,
  BarChart2,
  Tv
} from 'lucide-react';
import { FeedlyLogo } from './FeedlyLogo';
import { Video, Chapter, UserProfile } from '../types';

interface VideoPlayerViewProps {
  video: Video;
  user: UserProfile;
  subscriptionVideos: Video[];
  onBack: () => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
  onSelectVideo: (video: Video) => void;
  onOpenChannel: (channelId: string) => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  video,
  user,
  subscriptionVideos,
  onBack,
  onToggleSave,
  onToggleWatched,
  onSelectVideo,
  onOpenChannel,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(video.watchProgressSeconds || 525);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [isMuted, setIsMuted] = useState(false);
  const [useNativeEmbed, setUseNativeEmbed] = useState(true);
  const [notesOpen, setNotesOpen] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const duration = video.durationSeconds;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulated player tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !useNativeEmbed) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed, useNativeEmbed]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    setSeekSeconds(newTime);
  };

  const jumpToChapter = (chapter: Chapter, index: number) => {
    setCurrentTime(chapter.seconds);
    setActiveChapterIndex(index);
    setSeekSeconds(chapter.seconds);
    setUseNativeEmbed(true);
    setIsPlaying(true);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.youtubeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Up next videos from user's subscriptions
  const relatedSubscriptions = subscriptionVideos
    .filter((v) => v.id !== video.id)
    .slice(0, 3);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1${
    seekSeconds !== null ? `&start=${seekSeconds}` : ''
  }`;

  return (
    <div id="video-player-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-32">
      {/* Top Bar (Matching Image 1: Back arrow, Logo, Video Player, Avatar) */}
      <div className="flex items-center justify-between py-3 mb-2 border-b border-white/5">
        <button
          id="player-back-btn"
          onClick={onBack}
          className="p-1.5 -ml-1 text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          title="Back to Feed"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <FeedlyLogo size="sm" showText={false} />
          <span className="text-sm font-semibold tracking-tight text-[#F5F7FA]">
            Video Player
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-xs text-[#06B6D4] hover:underline flex items-center gap-1 bg-[#13161B] px-2 py-1 rounded-lg border border-white/10"
            title="Open on YouTube"
          >
            <span>YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
          />
        </div>
      </div>

      {/* Main Video Player Screen (Matching Image 1) */}
      <div
        id="player-viewport"
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group select-none"
      >
        {useNativeEmbed ? (
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* Background Thumbnail Image with dark overlay */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isPlaying ? 'opacity-85' : 'opacity-70'
              }`}
            />

            {/* Top Telemetry Overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[#06B6D4] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                1080p60 • Ad-free
              </span>
            </div>

            {/* Center Big Play / Pause Button */}
            <button
              id="player-center-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer shadow-2xl"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            {/* Player Bottom Scrub & Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
              {/* Scrub Slider */}
              <div className="relative mb-2 flex items-center">
                <input
                  id="player-scrubber"
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#06B6D4] focus:outline-none"
                />
              </div>

              {/* Bottom Buttons Row */}
              <div className="flex items-center justify-between text-xs text-[#e2e2e6]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <span className="font-mono text-[11px] text-[#9CA3AF]">
                    <span className="text-[#06B6D4] font-medium">{formatTime(currentTime)}</span>
                    {' / '}
                    <span>{video.duration}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cycleSpeed}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono font-semibold text-[#06B6D4] cursor-pointer"
                    title="Playback speed"
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-white cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setUseNativeEmbed(!useNativeEmbed)}
                    className="p-1 hover:text-white cursor-pointer text-[#9CA3AF]"
                    title="Toggle native YouTube iframe"
                  >
                    <Tv className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video Details Section */}
      <div className="mt-4">
        {/* Chips */}
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-[#6366F1]/15 text-[#c0c1ff] border border-[#6366F1]/30">
            Chronological Feed
          </span>
          <span className="text-[#9CA3AF]">•</span>
          <span className="text-[#06B6D4]">
            {video.isWatched ? 'Watched' : '• Unread •'}
          </span>
        </div>

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FA] leading-snug">
          {video.title}
        </h1>

        {/* Views & Publication Timestamp */}
        <p className="text-xs text-[#9CA3AF] mt-1.5">
          Published {video.publishedAt.split('T')[0]} • {video.views || '24.5k chronological views'} •{' '}
          <span className="text-[#06B6D4] font-medium">0 ads</span>
        </p>

        {/* Channel Row (Matching Image 1: Avatar, Name, Manage, Mute) */}
        <div className="mt-4 p-3 bg-[#13161B] border border-white/5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={video.channelAvatar}
                alt={video.channelTitle}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
              />
              {video.channelVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#6366F1] rounded-full flex items-center justify-center text-[8px] text-white">
                  ✓
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#F5F7FA]">
                  {video.channelTitle}
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Subscribed • 84 videos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChannel(video.channelId)}
              className="px-3 py-1.5 text-xs font-semibold text-[#e2e2e6] bg-[#1A1F26] hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#06B6D4]" />
              <span>Manage</span>
            </button>

            <button
              className="p-2 text-[#9CA3AF] hover:text-white bg-[#1A1F26] hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer"
              title="Channel notification settings"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Action Buttons (Saved to Watch Later, Mark as Watched, Share) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
          <button
            id="player-save-btn"
            onClick={() => onToggleSave(video.id)}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              video.isSaved
                ? 'bg-[#6366F1]/20 text-[#c0c1ff] border-[#6366F1]/50'
                : 'bg-[#13161B] text-[#e2e2e6] border-white/5 hover:bg-[#1A1F26]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${video.isSaved ? 'fill-current text-[#6366F1]' : ''}`} />
            <span>{video.isSaved ? 'Saved to Watch Later' : 'Watch Later'}</span>
          </button>

          <button
            id="player-watched-btn"
            onClick={() => onToggleWatched(video.id)}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              video.isWatched
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-[#13161B] text-[#e2e2e6] border-white/5 hover:bg-[#1A1F26]'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${video.isWatched ? 'text-emerald-400' : 'text-[#06B6D4]'}`} />
            <span>{video.isWatched ? 'Watched' : 'Mark as Watched'}</span>
          </button>

          <button
            id="player-share-btn"
            onClick={handleShare}
            className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl border border-white/5 bg-[#13161B] hover:bg-[#1A1F26] text-xs font-semibold text-[#e2e2e6] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#9CA3AF]" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Video'}</span>
          </button>
        </div>

        {/* Video Notes & Timestamps Accordion (Matching Image 1) */}
        <div className="mt-4 bg-[#13161B] border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <span className="text-sm font-semibold text-[#F5F7FA]">
                Video Notes & Timestamps
              </span>
            </div>
            {notesOpen ? (
              <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
            )}
          </button>

          {notesOpen && (
            <div className="p-3.5 pt-0 border-t border-white/5 space-y-4">
              <p className="text-xs text-[#c7c4d7] leading-relaxed mt-2.5">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags && (
                <div className="flex items-center gap-2 flex-wrap">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-[#1A1F26] border border-white/5 text-[11px] text-[#9CA3AF]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Chapters List */}
              {video.chapters && video.chapters.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase mb-2">
                    Chapters
                  </h4>
                  <div className="space-y-1.5">
                    {video.chapters.map((ch, idx) => {
                      const isActive = activeChapterIndex === idx;
                      return (
                        <div
                          key={ch.time}
                          onClick={() => jumpToChapter(ch, idx)}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-[#6366F1]/15 border border-[#6366F1]/40 text-[#c0c1ff]'
                              : 'hover:bg-white/5 text-[#e2e2e6]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />}
                            <span className="font-mono text-[#06B6D4] text-[11px]">
                              {ch.time}
                            </span>
                            <span className="font-medium text-xs line-clamp-1">
                              {ch.title}
                            </span>
                          </div>

                          {isActive ? (
                            <BarChart2 className="w-3.5 h-3.5 text-[#06B6D4] animate-pulse" />
                          ) : (
                            <Play className="w-3 h-3 text-[#9CA3AF]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deterministic Feed Active Banner (Matching Image 1) */}
        <div className="mt-4 p-3.5 bg-[#13161B] border border-white/5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5F7FA]">
                Deterministic Feed Active
              </p>
              <p className="text-[11px] text-[#9CA3AF]">
                No algorithmic suggestions • No toxic comments
              </p>
            </div>
          </div>
          <Lock className="w-4 h-4 text-[#9CA3AF]" />
        </div>

        {/* "From Your Subscriptions - X unwatched" (Matching Image 1) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#6366F1]" />
              <h3 className="text-sm font-bold text-[#F5F7FA]">
                From Your Subscriptions
              </h3>
            </div>
            <span className="text-xs text-[#06B6D4] font-medium">
              {relatedSubscriptions.length} unwatched
            </span>
          </div>

          <div className="space-y-2.5">
            {relatedSubscriptions.map((subVideo) => (
              <div
                key={subVideo.id}
                onClick={() => onSelectVideo(subVideo)}
                className="group p-2.5 bg-[#13161B] hover:bg-[#1A1F26] border border-white/5 hover:border-[#6366F1]/30 rounded-xl flex items-center gap-3 cursor-pointer transition-all"
              >
                <div className="relative aspect-video w-28 shrink-0 rounded-lg overflow-hidden bg-black/50">
                  <img
                    src={subVideo.thumbnail}
                    alt={subVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {subVideo.duration}
                  </span>
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#06B6D4]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#F5F7FA] group-hover:text-[#c0c1ff] line-clamp-2">
                    {subVideo.title}
                  </h4>
                  <p className="text-[11px] text-[#9CA3AF] mt-1 truncate">
                    {subVideo.channelTitle} • {subVideo.relativeTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
