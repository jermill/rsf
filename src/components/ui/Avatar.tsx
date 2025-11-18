import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string | React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {showFallback ? (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold">
          {typeof fallback === 'string' ? (
            <span className="uppercase">{fallback}</span>
          ) : fallback ? (
            fallback
          ) : (
            <User className="w-1/2 h-1/2" />
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

