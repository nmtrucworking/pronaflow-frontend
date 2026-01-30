/**
 * Avatar Component
 * Reusable avatar components for user profiles
 */

import React, { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';

// Main Avatar wrapper
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Avatar.displayName = 'Avatar';

// Avatar Image
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt = '', className = '', ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`aspect-square h-full w-full object-cover ${className}`}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

// Avatar Fallback
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

AvatarFallback.displayName = 'AvatarFallback';
