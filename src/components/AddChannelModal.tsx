import React, { useState } from 'react';
import { X, Tv, Plus, Check } from 'lucide-react';
import { Channel } from '../types';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: Channel) => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
}) => {
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech & Dev');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a channel title.');
      return;
    }

    const newChannel: Channel = {
      id: `ch-custom-${Date.now()}`,
      youtubeChannelId: `UC-${Date.now()}`,
      title: title.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`) : `@${title.trim().toLowerCase().replace(/\s+/g, '')}`,
      description: description.trim() || 'Subscribed channel tracked chronologically in FeedlyTube.',
      avatar: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80`,
      videoCount: 1,
      subscriberCount: '100K',
      category: category,
      latestVideoTime: 'Just now',
      unreadCount: 1,
      isFavorite: false,
      isMuted: false,
      isActive: true,
      verified: true,
    };

    onAddChannel(newChannel);
    onClose();
    setTitle('');
    setHandle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#111317] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/30">
            <Tv className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Subscribe to Channel</h2>
            <p className="text-xs text-[#9CA3AF]">Add any creator to your deterministic feed</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              Channel Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g. MKBHD or Fireship"
              className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#06B6D4] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              Channel Handle / Username
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@creatorname"
              className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#06B6D4] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#06B6D4] rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="Tech & Dev">Tech & Dev</option>
              <option value="Science">Science</option>
              <option value="Design">Design</option>
              <option value="Hardware">Hardware</option>
              <option value="Podcasts">Podcasts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this creator posts about..."
              className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 focus:border-[#06B6D4] rounded-xl text-xs text-white placeholder-[#9CA3AF] focus:outline-none resize-none"
            />
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
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold flex items-center gap-1.5 shadow-lg shadow-[#06B6D4]/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Subscribe Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
