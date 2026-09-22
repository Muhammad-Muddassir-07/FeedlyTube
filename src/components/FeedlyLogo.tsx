import React from 'react';

interface FeedlyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FeedlyLogo: React.FC<FeedlyLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div
      id="feedlytube-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer ${className}`}
    >
      {/* Icon Squircle */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#4361EE] via-[#3A86FF] to-[#00B4D8] flex items-center justify-center shadow-sm shrink-0 overflow-hidden`}
      >
        {/* Play Icon */}
        <svg
          className="w-3.5 h-3.5 text-black fill-current ml-0.5"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>

        {/* Accent Dot */}
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
      </div>

      {/* Typography */}
      {showText && (
        <div className={`font-semibold tracking-tight ${textSizes[size]} flex items-center`}>
          <span className="text-[#F5F7FA]">Feedly</span>
          <span className="text-[#6366F1] font-bold">Tube</span>
        </div>
      )}
    </div>
  );
};
