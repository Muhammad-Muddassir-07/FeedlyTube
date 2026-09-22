import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Lock,
  RotateCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Bell,
  Eye,
  CreditCard,
  LogOut,
  Zap,
  Youtube,
  Key,
  Database,
  ArrowRight
} from 'lucide-react';
import { FeedlyLogo } from './FeedlyLogo';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  onShowConnectModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onTriggerSync,
  isSyncing,
  onShowConnectModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'connection' | 'feed' | 'billing' | 'privacy'>('connection');
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [hideShorts, setHideShorts] = useState(true);
  const [hideLivestreams, setHideLivestreams] = useState(false);
  const [autoMarkWatched, setAutoMarkWatched] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15m');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      setApiKeySaved(true);
      setTimeout(() => setApiKeySaved(false), 3000);
    }
  };

  return (
    <div id="settings-view-container" className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-32">
      {/* Settings Navigation Subtabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#13161B] border border-white/5 rounded-xl mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('connection')}
          className={`flex-1 min-w-[110px] py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'connection'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          YouTube Sync
        </button>
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`flex-1 min-w-[110px] py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'feed'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Feed Rules
        </button>
        <button
          onClick={() => setActiveSubTab('billing')}
          className={`flex-1 min-w-[110px] py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'billing'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Plan & Pro
        </button>
        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`flex-1 min-w-[110px] py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'privacy'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Privacy & Security
        </button>
      </div>

      {/* Tab: YouTube Sync / Connection (Matches Image 3) */}
      {activeSubTab === 'connection' && (
        <div className="space-y-6">
          {/* Step 2 of 4 card matching Image 3 */}
          <div className="bg-[#111317] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Step Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase mb-2">
                <span className="text-[#06B6D4]">Step 2 of 4</span>
                <span className="text-[#9CA3AF]">50% Completed</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#06B6D4]" />
              </div>
            </div>

            {/* Brand Logo & Chip */}
            <div className="flex flex-col items-center text-center mb-6">
              <FeedlyLogo size="lg" className="mb-3" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-xs font-semibold text-[#06B6D4] mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>Deterministic Clarity</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FA]">
                Build a feed that belongs to you.
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-md mt-2 leading-relaxed">
                FeedlyTube securely connects with your Google account to fetch only the channels you subscribe to. No algorithms, no shorts, no recommendations.
              </p>
            </div>

            {/* Permission Scope Card */}
            <div className="bg-[#13161B] border border-white/5 rounded-xl p-4 sm:p-5 space-y-4 mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F7FA]">
                  <div className="w-6 h-6 rounded-md bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>Permission Scope</span>
                  <Lock className="w-3.5 h-3.5 text-[#06B6D4]" />
                </div>
                <span className="text-[11px] font-mono text-[#9CA3AF]">OAuth 2.0 Restricted Scope</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#e2e2e6]">Read-only access to YouTube Subscriptions</p>
                    <p className="text-[11px] text-[#9CA3AF]">Syncs your creator list chronologically</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#e2e2e6]">Never posts, likes, or comments on your behalf</p>
                    <p className="text-[11px] text-[#9CA3AF]">Zero write permissions requested or needed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#e2e2e6]">Zero advertising data tracking or profiling</p>
                    <p className="text-[11px] text-[#9CA3AF]">Tokens encrypted with AES-256 GCM</p>
                  </div>
                </div>
              </div>

              {/* Target Feed Callout Box */}
              <div className="p-3 bg-[#1A1F26] border border-white/5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  <span className="text-xs font-medium text-[#e2e2e6]">Target Feed: Pure Chronological</span>
                </div>
                <span className="text-xs text-[#06B6D4] font-medium">0 Algorithmic Injectors</span>
              </div>
            </div>

            {/* Connect Button */}
            <button
              id="connect-youtube-btn"
              onClick={onShowConnectModal}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Connect YouTube Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Sub-badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#9CA3AF] flex-wrap">
              <span className="flex items-center gap-1">
                <span className="font-bold text-[#e2e2e6]">G</span> Google OAuth Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#06B6D4]">
                <CheckCircle2 className="w-3 h-3" /> YouTube Data API v3
              </span>
            </div>

            {/* Collapsible Privacy Info */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => setPrivacyExpanded(!privacyExpanded)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#06B6D4] hover:underline cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>How we protect your privacy & token security</span>
                {privacyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {privacyExpanded && (
                <div className="mt-3 p-3.5 bg-[#13161B] rounded-xl text-xs text-[#9CA3AF] space-y-2 leading-relaxed">
                  <p>
                    FeedlyTube only requests the minimal scope <code className="text-[#c0c1ff] font-mono">youtube.readonly</code> to read subscription channels.
                  </p>
                  <p>
                    Tokens are salted and encrypted with industry-standard AES-256 GCM in Postgres. FeedlyTube never reads your private watch history, personal search queries, or comments.
                  </p>
                  <p className="text-[#06B6D4]">
                    Official YouTube Data API v3 integration. Revoke access anytime with one click in your Google Security Dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sync Controls Card */}
          <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[#F5F7FA] mb-1">
              Background Synchronization Status
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              FeedlyTube uses incremental RSS polling and scheduled workers to fetch fresh videos without draining your YouTube API quota.
            </p>

            <div className="flex items-center justify-between p-3.5 bg-[#1A1F26] rounded-xl border border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
                  <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#e2e2e6]">
                    {user.channelCount} Channels Synchronized
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    Last synced: {user.lastSyncedAt} • Next automated check in 12m
                  </p>
                </div>
              </div>

              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer transition-colors"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            {/* Custom YouTube Data API Key (Optional Override) */}
            <form onSubmit={handleSaveApiKey} className="pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold text-[#e2e2e6] mb-1">
                Optional: Custom YouTube Data API v3 Key
              </label>
              <p className="text-[11px] text-[#9CA3AF] mb-2">
                Use your own Google Cloud API Key for dedicated quota and instant updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-2 bg-[#1A1F26] border border-white/10 rounded-xl text-xs text-[#e2e2e6] focus:outline-none focus:border-[#6366F1]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1A1F26] hover:bg-white/10 text-[#06B6D4] border border-[#06B6D4]/30 cursor-pointer"
                >
                  {apiKeySaved ? 'Saved!' : 'Save Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Feed Rules & Preferences */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4">
          <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Distraction-Free Rules</h3>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-xs font-semibold text-[#e2e2e6]">Strict Chronological Feed</p>
                <p className="text-[11px] text-[#9CA3AF]">Order purely by release timestamp. Zero machine learning ordering.</p>
              </div>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="w-4 h-4 accent-[#6366F1] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-xs font-semibold text-[#e2e2e6]">Hide YouTube Shorts</p>
                <p className="text-[11px] text-[#9CA3AF]">Filter out vertical shorts under 60 seconds from the feed.</p>
              </div>
              <input
                type="checkbox"
                checked={hideShorts}
                onChange={(e) => setHideShorts(e.target.checked)}
                className="w-4 h-4 accent-[#6366F1] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-xs font-semibold text-[#e2e2e6]">Hide Live Streams & Premieres</p>
                <p className="text-[11px] text-[#9CA3AF]">Exclude pending countdowns and livestreams.</p>
              </div>
              <input
                type="checkbox"
                checked={hideLivestreams}
                onChange={(e) => setHideLivestreams(e.target.checked)}
                className="w-4 h-4 accent-[#6366F1] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-semibold text-[#e2e2e6]">Auto-Mark as Watched</p>
                <p className="text-[11px] text-[#9CA3AF]">Automatically mark video watched when reaching 90% completion.</p>
              </div>
              <input
                type="checkbox"
                checked={autoMarkWatched}
                onChange={(e) => setAutoMarkWatched(e.target.checked)}
                className="w-4 h-4 accent-[#6366F1] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Billing & Plans */}
      {activeSubTab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#06B6D4] tracking-wider uppercase">Active Entitlement</span>
                <h3 className="text-base font-bold text-[#F5F7FA]">FeedlyTube Pro Lifetime</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-xs font-semibold text-[#c0c1ff]">
                Active
              </span>
            </div>

            <p className="text-xs text-[#9CA3AF] mb-4">
              Your account includes unlimited channel subscriptions, 15-minute background sync, ad-free clean playback, and custom thematic folders.
            </p>

            <div className="p-3 bg-[#1A1F26] rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">Billing Model: Modular Adapter (Stripe / LemonSqueezy ready)</span>
              <span className="text-[#06B6D4] font-medium">Enterprise Tier</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Privacy & Security */}
      {activeSubTab === 'privacy' && (
        <div className="space-y-4">
          <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Data Protection & Privacy</h3>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              FeedlyTube operates on a zero-tracking guarantee. We never store personal search queries, we never inject advertising pixels, and we never train algorithmic models on your watching habits.
            </p>

            <div className="pt-3 border-t border-white/5 space-y-3">
              <button
                onClick={() => {
                  alert('Exporting your 42 subscriptions as OPML / JSON...');
                }}
                className="w-full py-2.5 px-3 bg-[#1A1F26] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-[#e2e2e6] text-left flex items-center justify-between cursor-pointer"
              >
                <span>Export Subscriptions (OPML / JSON)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Disconnect YouTube account? Your subscription feed will pause.')) {
                    onUpdateUser({ isGoogleConnected: false });
                  }
                }}
                className="w-full py-2.5 px-3 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-300 text-left flex items-center justify-between cursor-pointer"
              >
                <span>Disconnect YouTube Account</span>
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
