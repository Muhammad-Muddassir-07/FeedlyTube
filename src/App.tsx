import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/FeedView';
import { ChannelsView } from './components/ChannelsView';
import { VideoPlayerView } from './components/VideoPlayerView';
import { QueueView } from './components/QueueView';
import { FoldersView } from './components/FoldersView';
import { SettingsView } from './components/SettingsView';
import { SearchModal } from './components/SearchModal';
import { ConnectYouTubeModal } from './components/ConnectYouTubeModal';
import {
  INITIAL_USER,
  INITIAL_CHANNELS,
  INITIAL_VIDEOS,
  INITIAL_COLLECTIONS,
} from './data/mockData';
import { Video, Channel, Collection, UserProfile, TabType } from './types';

export default function App() {
  // Load persistent state from localStorage if available
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('feedlytube_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('feedlytube_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('feedlytube_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('feedlytube_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('feedlytube_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('feedlytube_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('feedlytube_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('feedlytube_collections', JSON.stringify(collections));
  }, [collections]);

  // Derived counts
  const unreadCount = videos.filter((v) => !v.isWatched).length;
  const queueCount = videos.filter((v) => v.isSaved).length;

  // Handlers
  const handleToggleSave = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isSaved: !v.isSaved } : v))
    );
    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const handleToggleWatched = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isWatched: !v.isWatched } : v))
    );
    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo((prev) => (prev ? { ...prev, isWatched: !prev.isWatched } : null));
    }
  };

  const handleToggleChannelFavorite = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleToggleChannelMute = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setUser((prev) => ({ ...prev, lastSyncedAt: 'just now' }));
    }, 1500);
  };

  const handleCreateCollection = (name: string, description: string) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      description,
      videoIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      color: '#6366F1',
    };
    setCollections((prev) => [...prev, newCol]);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearQueue = () => {
    setVideos((prev) => prev.map((v) => ({ ...v, isSaved: false })));
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#e2e2e6] flex flex-col selection:bg-[#6366F1]/30">
      {/* Top Header */}
      {!activeVideo && (
        <Header
          user={user}
          unreadCount={unreadCount}
          currentTab={currentTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setCurrentTab('settings')}
          onLogoClick={() => {
            setActiveVideo(null);
            setCurrentTab('feed');
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeVideo ? (
          <VideoPlayerView
            video={activeVideo}
            user={user}
            subscriptionVideos={videos}
            onBack={() => setActiveVideo(null)}
            onToggleSave={handleToggleSave}
            onToggleWatched={handleToggleWatched}
            onSelectVideo={(v) => setActiveVideo(v)}
            onOpenChannel={(chId) => {
              setActiveVideo(null);
              setCurrentTab('channels');
            }}
          />
        ) : (
          <>
            {currentTab === 'feed' && (
              <FeedView
                videos={videos}
                channelCount={channels.length}
                lastSynced={user.lastSyncedAt}
                isSyncing={isSyncing}
                onRefresh={handleSync}
                onSelectVideo={(v) => setActiveVideo(v)}
                onToggleSave={handleToggleSave}
                onToggleWatched={handleToggleWatched}
                onNavigateToChannels={() => setCurrentTab('channels')}
              />
            )}

            {currentTab === 'channels' && (
              <ChannelsView
                channels={channels}
                videos={videos}
                onToggleFavorite={handleToggleChannelFavorite}
                onToggleMute={handleToggleChannelMute}
                onSyncChannels={handleSync}
                isSyncing={isSyncing}
                onSelectVideo={(v) => setActiveVideo(v)}
                onToggleSave={handleToggleSave}
                onToggleWatched={handleToggleWatched}
              />
            )}

            {currentTab === 'queue' && (
              <QueueView
                videos={videos}
                onSelectVideo={(v) => setActiveVideo(v)}
                onToggleSave={handleToggleSave}
                onToggleWatched={handleToggleWatched}
                onClearQueue={handleClearQueue}
                onNavigateToFeed={() => setCurrentTab('feed')}
              />
            )}

            {currentTab === 'folders' && (
              <FoldersView
                collections={collections}
                videos={videos}
                onCreateCollection={handleCreateCollection}
                onDeleteCollection={handleDeleteCollection}
                onSelectVideo={(v) => setActiveVideo(v)}
                onToggleSave={handleToggleSave}
                onToggleWatched={handleToggleWatched}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                onTriggerSync={handleSync}
                isSyncing={isSyncing}
                onShowConnectModal={() => setIsConnectModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Dock */}
      {!activeVideo && (
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => {
            setActiveVideo(null);
            setCurrentTab(tab);
          }}
          unreadCount={unreadCount}
          queueCount={queueCount}
        />
      )}

      {/* Global Spotlight Search (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        videos={videos}
        channels={channels}
        onSelectVideo={(v) => {
          setActiveVideo(v);
          setIsSearchOpen(false);
        }}
        onSelectChannel={(c) => {
          setCurrentTab('channels');
          setIsSearchOpen(false);
        }}
      />

      {/* Connect YouTube Modal (Step 2 of 4) */}
      <ConnectYouTubeModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectSuccess={() => {
          setUser((prev) => ({ ...prev, isGoogleConnected: true, lastSyncedAt: 'just now' }));
        }}
      />
    </div>
  );
}
