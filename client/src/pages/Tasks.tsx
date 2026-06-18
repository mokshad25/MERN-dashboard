import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { taskService } from '@/services/taskService';
import { TaskFiltersBar } from '@/components/tasks/TaskFilters';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { Button } from '@/components/ui/Button';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';
import { Task, TaskFilters } from '@/types';
import { statusConfig, priorityConfig, getDueDateLabel } from '@/utils/helpers';
import { cn } from '@/utils/cn';

const defaultFilters: TaskFilters = {
  search: '', status: 'all', priority: 'all', category: '', sort: '-createdAt',
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task | null }>({ open: false });

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const tasks = data?.data ?? [];

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.total ?? 0} {data?.total === 1 ? 'task' : 'tasks'} total
          </p>
        </div>
        <Button onClick={() => setTaskModal({ open: true })} icon={<Plus size={14} />}>
          New Task
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1">
          <TaskFiltersBar filters={filters} onChange={setFilters} />
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-0.5 gap-0.5">
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                view === v
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-100'
                  : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              )}
            >
              {v === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={cn('gap-3', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col')}>
          {Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
            <Plus size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">No tasks found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first task to get started</p>
          <Button className="mt-4" onClick={() => setTaskModal({ open: true })}>
            Create Task
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className={cn('gap-3', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col')}>
            {tasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.03 }}
              >
                {view === 'grid' ? (
                  <TaskCard
                    task={task}
                    onEdit={(t) => setTaskModal({ open: true, task: t })}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ) : (
                  <ListTaskRow
                    task={task}
                    onEdit={(t) => setTaskModal({ open: true, task: t })}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      <TaskModal
        open={taskModal.open}
        task={taskModal.task}
        onClose={() => setTaskModal({ open: false })}
      />
    </div>
  );
}

function ListTaskRow({ task, onEdit, onDelete }: { task: Task; onEdit: (t: Task) => void; onDelete: (id: string) => void }) {
  const due = getDueDateLabel(task.dueDate);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 hover:shadow-card-hover transition-shadow">
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium text-gray-800 dark:text-gray-100 truncate',
          task.status === 'completed' && 'line-through text-gray-400 dark:text-gray-500'
        )}>
          {task.title}
        </p>
        {task.category && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.category}</p>}
      </div>
      <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0', status.color)}>{status.label}</span>
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', priority.color)}>{priority.label}</span>
      <span className={cn('text-xs flex-shrink-0', due.color)}>{due.label}</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onEdit(task)} className="text-xs text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">Edit</button>
        <button onClick={() => onDelete(task._id)} className="text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">Delete</button>
      </div>
    </div>
  );
}
