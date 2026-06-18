import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-9 rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-900 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-all duration-150',
              'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
              error && 'border-red-300',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
