import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-400 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Dumbbell className="w-8 h-8 text-amber-500/70 mb-2 shrink-0" />
        <span className="text-xs font-medium text-neutral-300 max-w-[200px] line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
