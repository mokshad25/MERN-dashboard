import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-card dark:bg-gray-800 dark:border-gray-700',
        hover && 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-gray-900', className)}>{children}</h3>;
}
