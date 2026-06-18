import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardStats } from '@/types';
import { KPICardSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

interface KPICardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

const cards = [
  {
    key: 'total' as const,
    label: 'Total Tasks',
    icon: ListTodo,
    iconBg: 'bg-primary-50',
    darkIconBg: 'dark:bg-primary-900/30',
    iconColor: 'text-primary-600',
    darkIconColor: 'dark:text-primary-400',
    barColor: 'bg-primary-500',
    gradient: 'from-primary-50 to-white',
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    icon: CheckCircle2,
    iconBg: 'bg-green-50',
    darkIconBg: 'dark:bg-green-900/30',
    iconColor: 'text-green-600',
    darkIconColor: 'dark:text-green-400',
    barColor: 'bg-green-500',
    gradient: 'from-green-50 to-white',
  },
  {
    key: 'pending' as const,
    label: 'In Progress',
    icon: Clock,
    iconBg: 'bg-amber-50',
    darkIconBg: 'dark:bg-amber-900/30',
    iconColor: 'text-amber-600',
    darkIconColor: 'dark:text-amber-400',
    barColor: 'bg-amber-500',
    gradient: 'from-amber-50 to-white',
  },
  {
    key: 'overdue' as const,
    label: 'Overdue',
    icon: AlertCircle,
    iconBg: 'bg-red-50',
    darkIconBg: 'dark:bg-red-900/30',
    iconColor: 'text-red-600',
    darkIconColor: 'dark:text-red-400',
    barColor: 'bg-red-500',
    gradient: 'from-red-50 to-white',
  },
];

export function KPICards({ stats, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
    );
  }

  const overview = stats?.overview;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, iconBg, darkIconBg, iconColor, darkIconColor, barColor, gradient }, i) => {
        const value = overview?.[key] ?? 0;
        const total = overview?.total ?? 1;
        const pct = key !== 'total' ? Math.round((value / total) * 100) : 100;
        const isNegative = key === 'overdue' && value > 0;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={cn(
              'bg-white rounded-2xl border border-gray-100 shadow-card p-5 bg-gradient-to-br',
              'dark:bg-none dark:bg-gray-800 dark:border-gray-700',
              gradient
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg, darkIconBg)}>
                <Icon size={18} className={cn(iconColor, darkIconColor)} />
              </div>
              <div className={cn('flex items-center gap-1 text-xs font-medium', isNegative ? 'text-red-500' : 'text-green-600')}>
                {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {pct}%
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            </div>
            <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                className={cn('h-full rounded-full', barColor)}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
