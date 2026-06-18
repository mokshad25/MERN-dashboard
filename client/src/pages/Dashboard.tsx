import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { taskService } from '@/services/taskService';
import { KPICards } from '@/components/dashboard/KPICards';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task | null; status?: TaskStatus }>({ open: false });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: taskService.getStats,
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', { limit: 100 }],
    queryFn: () => taskService.getTasks({ sort: 'order' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => toast.error('Failed to move task'),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => toast.error('Failed to delete task'),
  });

  const stats = statsData?.data;
  const tasks = tasksData?.data ?? [];

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your tasks today · {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        {stats && (
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {stats.overview.recentCompleted} completed this week
          </div>
        )}
      </motion.div>

      {/* KPI Cards */}
      <KPICards stats={stats} isLoading={statsLoading} />

      {/* Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Task Board</h2>
          <button
            onClick={() => setTaskModal({ open: true })}
            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            + Add task
          </button>
        </div>
        <KanbanBoard
          tasks={tasks}
          isLoading={tasksLoading}
          onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
          onEdit={(task) => setTaskModal({ open: true, task })}
          onDelete={(id) => deleteMutation.mutate(id)}
          onCreateInColumn={(status) => setTaskModal({ open: true, status })}
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Analytics</h2>
          <AnalyticsCharts stats={stats} isLoading={statsLoading} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <ActivityTimeline tasks={stats?.recentTasks ?? []} isLoading={statsLoading} />
        </div>
      </div>

      <TaskModal
        open={taskModal.open}
        task={taskModal.task}
        defaultStatus={taskModal.status}
        onClose={() => setTaskModal({ open: false })}
      />
    </div>
  );
}
