import React from 'react';
import { Newspaper, Tv, Clock, Folder, SlidersHorizontal } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount: number;
  queueCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  unreadCount,
  queueCount,
}) => {
  const tabs = [
    {
      id: 'feed' as TabType,
      label: 'Feed',
      icon: Newspaper,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'channels' as TabType,
      label: 'Channels',
      icon: Tv,
    },
    {
      id: 'queue' as TabType,
      label: 'Queue',
      icon: Clock,
      badge: queueCount > 0 ? queueCount : undefined,
    },
    {
      id: 'folders' as TabType,
      label: 'Folders',
      icon: Folder,
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <nav
      id="bottom-dock-navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#111317]/95 backdrop-blur-lg border-t border-white/5 py-1.5 transition-colors"
    >
      <div className="max-w-md mx-auto px-4 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#6366F1]'
                  : 'text-[#9CA3AF] hover:text-[#e2e2e6] hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] text-[9px] font-bold flex items-center justify-center rounded-full bg-[#06B6D4] text-[#0B0D10]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 font-medium ${
                  isActive ? 'text-[#6366F1] font-semibold' : 'text-[#9CA3AF]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
