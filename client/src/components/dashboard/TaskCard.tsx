import { motion } from 'framer-motion';
import { Calendar, Tag, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getDueDateLabel, priorityConfig } from '@/utils/helpers';
import { cn } from '@/utils/cn';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const priorityBorderColor: Record<string, string> = {
  urgent: 'border-l-red-400',
  high: 'border-l-orange-400',
  medium: 'border-l-amber-400',
  low: 'border-l-green-400',
};

export function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const due = getDueDateLabel(task.dueDate);
  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 shadow-card cursor-pointer',
        'border-l-2 group relative',
        'hover:shadow-card-hover transition-shadow',
        isDragging && 'shadow-elevated rotate-1 opacity-90',
        priorityBorderColor[task.priority]
      )}
    >
      {/* Actions */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-7 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl shadow-elevated py-1 w-36 z-10"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit?.(task); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Pencil size={12} /> Edit task
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(task._id); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className={cn(
        'text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug pr-8 mb-2.5',
        task.status === 'completed' && 'line-through text-gray-400 dark:text-gray-500'
      )}>
        {task.title}
      </p>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', priority.color)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', priority.dot)} />
          {priority.label}
        </span>
        {task.category && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {task.category}
          </span>
        )}
        {task.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
            <Tag size={9} />{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={cn('flex items-center gap-1 text-xs', due.color)}>
          <Calendar size={11} />
          <span>{due.label}</span>
        </div>
        {task.assignedTo && <Avatar name={task.assignedTo.name} size="xs" />}
      </div>
    </motion.div>
  );
}
