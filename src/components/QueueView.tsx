import React, { useMemo } from 'react';
import { Clock, Play, Trash2, CheckCircle, BookmarkCheck, ArrowRight } from 'lucide-react';
import { Video } from '../types';
import { VideoCard } from './VideoCard';

interface QueueViewProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
  onClearQueue: () => void;
  onNavigateToFeed: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  videos,
  onSelectVideo,
  onToggleSave,
  onToggleWatched,
  onClearQueue,
  onNavigateToFeed,
}) => {
  const savedVideos = useMemo(() => videos.filter((v) => v.isSaved), [videos]);

  const totalDurationMinutes = useMemo(() => {
    const totalSecs = savedVideos.reduce((acc, v) => acc + v.durationSeconds, 0);
    return Math.round(totalSecs / 60);
  }, [savedVideos]);

  return (
    <div id="queue-view-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-32">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
            Watch Later Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
            <span className="text-[#6366F1] font-semibold">{savedVideos.length} videos queued</span>
            <span>•</span>
            <span>~{totalDurationMinutes} mins total focus</span>
          </p>
        </div>

        {savedVideos.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectVideo(savedVideos[0])}
              className="px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All</span>
            </button>

            <button
              onClick={onClearQueue}
              className="p-2 text-[#9CA3AF] hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Clear queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Videos List */}
      {savedVideos.length > 0 ? (
        <div className="space-y-4">
          {savedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelectVideo={onSelectVideo}
              onToggleSave={onToggleSave}
              onToggleWatched={onToggleWatched}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 p-12 bg-[#13161B] border border-white/5 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1] mb-3">
            <BookmarkCheck className="w-6 h-6" />
          </div>

          <h3 className="text-base font-semibold text-[#F5F7FA]">
            Your Watch Later queue is empty
          </h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mt-1 leading-relaxed">
            Click the bookmark icon on any subscription video to save it here for intentional, distraction-free viewing.
          </p>

          <button
            onClick={onNavigateToFeed}
            className="mt-5 px-4 py-2 rounded-xl bg-[#1A1F26] hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#c0c1ff] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Browse Chronological Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
