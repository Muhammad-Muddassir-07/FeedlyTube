import React, { useState } from 'react';
import { X, Youtube, Plus, Link, Sparkles, Check } from 'lucide-react';
import { Video } from '../types';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: Video) => void;
  onPlayDirectly: (video: Video) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideo,
  onPlayDirectly,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [channelInput, setChannelInput] = useState('My Subscriptions');
  const [categoryInput, setCategoryInput] = useState('Tech & Dev');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Extract YouTube ID from various URL formats
  const extractYouTubeId = (url: string): string | null => {
    const trimmed = url.trim();
    if (!trimmed) return null;
    
    // Direct ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    
    // Standard watch URL: youtube.com/watch?v=ID
    const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }
    
    return null;
  };

  const handleAdd = (playNow: boolean) => {
    setError('');
    const videoId = extractYouTubeId(urlInput);
    if (!videoId) {
      setError('Please enter a valid YouTube Video URL or 11-character video ID.');
      return;
    }

    const title = titleInput.trim() || `YouTube Video (${videoId})`;
    const channelName = channelInput.trim() || 'Custom Channel';

    const newVideo: Video = {
      id: `v-custom-${Date.now()}`,
      youtubeVideoId: videoId,
      channelId: `ch-${Date.now()}`,
      channelTitle: channelName,
      channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      channelVerified: true,
      title: title,
      description: 'Added via direct YouTube URL link to FeedlyTube feed.',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: new Date().toISOString(),
      relativeTime: 'Just now',
      duration: '10:00',
      durationSeconds: 600,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embeddable: true,
      isWatched: false,
      isSaved: false,
      isNew: true,
      badgeLabel: 'NEW',
      category: categoryInput,
      views: 'Chronological subscriber feed',
      tags: ['youtube', 'custom', 'stream'],
      chapters: [
        { time: '00:00', seconds: 0, title: 'Start' }
      ]
    };

    onAddVideo(newVideo);
    if (playNow) {
      onPlayDirectly(newVideo);
    }
    onClose();
    setUrlInput('');
    setTitleInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#111317] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-[#6366F1]/20 border border-[#6366F1]/30">
            <Youtube className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add Any YouTube Video</h2>
            <p className="text-xs text-[#9CA3AF]">Paste any link to watch directly inside clean FeedlyTube</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              YouTube Video URL or ID *
            </label>
            <div className="relative">
              <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError('');
                }}
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                className="w-full pl-9 pr-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#6366F1] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-1">Supports standard YouTube URLs, Shorts, and 11-char IDs.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              Video Title (Optional)
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. My Favorite Coding Lecture"
              className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#6366F1] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
                Channel / Creator Name
              </label>
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Creator Name"
                className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#6366F1] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
                Category
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#6366F1] rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Tech & Dev">Tech & Dev</option>
                <option value="Science">Science</option>
                <option value="Design">Design</option>
                <option value="Hardware">Hardware</option>
                <option value="Podcasts">Podcasts</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleAdd(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1A1F26] hover:bg-[#252B35] text-white border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Feed
          </button>
          <button
            type="button"
            onClick={() => handleAdd(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#6366F1] hover:bg-[#5558E6] text-white flex items-center gap-1.5 shadow-lg shadow-[#6366F1]/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};
