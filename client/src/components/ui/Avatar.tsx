import { cn } from '@/utils/cn';
import { getInitials, generateAvatarColor } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-sm' };

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white',
        generateAvatarColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
