import React, { useState } from 'react';
import { Folder, Plus, Trash2, Edit2, Play, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { Collection, Video } from '../types';
import { VideoCard } from './VideoCard';

interface FoldersViewProps {
  collections: Collection[];
  videos: Video[];
  onCreateCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
  onSelectVideo: (video: Video) => void;
  onToggleSave: (videoId: string) => void;
  onToggleWatched: (videoId: string) => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  collections,
  videos,
  onCreateCollection,
  onDeleteCollection,
  onSelectVideo,
  onToggleSave,
  onToggleWatched,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateCollection(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const collectionVideos = selectedCollection
    ? videos.filter((v) => selectedCollection.videoIds.includes(v.id))
    : [];

  return (
    <div id="folders-view-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-32">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
            {selectedCollection ? selectedCollection.name : 'Collections'}
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            {selectedCollection
              ? `${collectionVideos.length} videos organized`
              : 'Thematic folders for intentional study and curation'}
          </p>
        </div>

        {selectedCollection ? (
          <button
            onClick={() => setSelectedCollection(null)}
            className="px-3 py-1.5 rounded-lg bg-[#1A1F26] hover:bg-white/10 text-xs font-semibold text-[#e2e2e6] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Folders</span>
          </button>
        ) : (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        )}
      </div>

      {selectedCollection ? (
        /* Folder Detail View */
        <div className="space-y-4">
          <div className="p-4 bg-[#13161B] border border-white/5 rounded-xl flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">{selectedCollection.description}</p>
            <button
              onClick={() => {
                onDeleteCollection(selectedCollection.id);
                setSelectedCollection(null);
              }}
              className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Folder</span>
            </button>
          </div>

          {collectionVideos.length > 0 ? (
            <div className="space-y-4">
              {collectionVideos.map((video) => (
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
            <div className="p-8 text-center text-xs text-[#9CA3AF] bg-[#13161B] rounded-xl border border-white/5">
              No videos added to this collection yet. Add videos from the feed menu!
            </div>
          )}
        </div>
      ) : (
        /* Folders Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collections.map((col) => {
            const count = col.videoIds.length;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(col)}
                className="group p-4 bg-[#13161B] hover:bg-[#1A1F26] border border-white/5 hover:border-[#6366F1]/40 rounded-xl transition-all cursor-pointer flex flex-col justify-between h-36"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${col.color || '#6366F1'}20`, color: col.color || '#6366F1' }}
                  >
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#9CA3AF] bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                    {count} {count === 1 ? 'video' : 'videos'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#F5F7FA] group-hover:text-[#c0c1ff] truncate">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] line-clamp-1 mt-0.5">
                    {col.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#111317] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="text-sm font-bold text-[#F5F7FA]">Create New Collection</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Masterclass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 rounded-xl text-sm text-[#e2e2e6] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Core architectural papers & videos"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1F26] border border-white/10 rounded-xl text-sm text-[#e2e2e6] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
