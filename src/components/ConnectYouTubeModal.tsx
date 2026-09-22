import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Lock,
  X,
  Youtube,
  RotateCw,
  ArrowRight,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FeedlyLogo } from './FeedlyLogo';

interface ConnectYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: () => void;
}

export const ConnectYouTubeModal: React.FC<ConnectYouTubeModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
}) => {
  const [step, setStep] = useState<'prompt' | 'oauth_popup' | 'syncing' | 'complete'>('prompt');
  const [privacyExpanded, setPrivacyExpanded] = useState(false);

  if (!isOpen) return null;

  const handleStartOAuth = () => {
    setStep('oauth_popup');
    // Simulate real OAuth consent flow
    setTimeout(() => {
      setStep('syncing');
      setTimeout(() => {
        setStep('complete');
        setTimeout(() => {
          onConnectSuccess();
          onClose();
          setStep('prompt');
        }, 1200);
      }, 1600);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#111317] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'prompt' && (
          <div>
            {/* Step 2 of 4 (Matching Image 3) */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase mb-2">
                <span className="text-[#06B6D4]">Step 2 of 4</span>
                <span className="text-[#9CA3AF]">50% Completed</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#06B6D4]" />
              </div>
            </div>

            <div className="flex flex-col items-center text-center mb-5">
              <FeedlyLogo size="lg" className="mb-2.5" />
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-xs font-semibold text-[#06B6D4] mb-2.5">
                <Zap className="w-3 h-3" />
                <span>Deterministic Clarity</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FA]">
                Build a feed that belongs to you.
              </h2>
              <p className="text-xs text-[#9CA3AF] max-w-sm mt-1.5 leading-relaxed">
                FeedlyTube securely connects with your Google account to fetch only the channels you subscribe to. No algorithms, no shorts, no recommendations.
              </p>
            </div>

            {/* Permission Scope Card (Matching Image 3) */}
            <div className="bg-[#13161B] border border-white/5 rounded-xl p-4 space-y-3 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F7FA]">
                  <Shield className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Permission Scope</span>
                  <Lock className="w-3.5 h-3.5 text-[#06B6D4]" />
                </div>
                <span className="text-[11px] font-mono text-[#9CA3AF]">OAuth 2.0 Restricted</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#e2e2e6]">Read-only access to YouTube Subscriptions</p>
                    <p className="text-[11px] text-[#9CA3AF]">Syncs your creator list chronologically</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#e2e2e6]">Never posts, likes, or comments on your behalf</p>
                    <p className="text-[11px] text-[#9CA3AF]">Zero write permissions requested or needed</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#e2e2e6]">Zero advertising data tracking or profiling</p>
                    <p className="text-[11px] text-[#9CA3AF]">Tokens encrypted with AES-256 GCM</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#1A1F26] border border-white/5 rounded-lg flex items-center justify-between text-xs">
                <span className="text-[#e2e2e6] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  Target Feed: Pure Chronological
                </span>
                <span className="text-[#06B6D4] font-medium">0 Algorithmic Injectors</span>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleStartOAuth}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Connect YouTube Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#9CA3AF]">
              <span>Google OAuth Certified</span>
              <span>•</span>
              <span className="text-[#06B6D4]">YouTube Data API v3</span>
            </div>
          </div>
        )}

        {step === 'oauth_popup' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
              <RotateCw className="w-7 h-7 text-[#6366F1] animate-spin" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7FA]">
              Authorizing via Google Identity Services...
            </h3>
            <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
              Requesting restricted read-only scope for subscription channels.
            </p>
          </div>
        )}

        {step === 'syncing' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 mx-auto flex items-center justify-center">
              <RotateCw className="w-7 h-7 text-[#06B6D4] animate-spin" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7FA]">
              Synchronizing 42 Subscriptions...
            </h3>
            <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
              Evaluating channel uploads and compiling your deterministic chronological timeline.
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7FA]">
              YouTube Connected Successfully!
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              42 channels connected • 14 fresh videos populated into your feed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
