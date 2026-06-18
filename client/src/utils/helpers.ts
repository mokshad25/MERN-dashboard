import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date: string | Date | null): string => {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDueDateLabel = (date: string | null): { label: string; color: string } => {
  if (!date) return { label: 'No due date', color: 'text-gray-400' };
  const d = new Date(date);
  if (isPast(d)) return { label: `Overdue · ${format(d, 'MMM d')}`, color: 'text-red-500' };
  if (isToday(d)) return { label: 'Due today', color: 'text-amber-500' };
  if (isTomorrow(d)) return { label: 'Due tomorrow', color: 'text-amber-400' };
  return { label: format(d, 'MMM d'), color: 'text-gray-500' };
};

export const priorityConfig = {
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', dot: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500' },
  low: { label: 'Low', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', dot: 'bg-green-500' },
};

export const statusConfig = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', icon: '○' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: '◐' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: '●' },
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-green-500', 'bg-orange-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
