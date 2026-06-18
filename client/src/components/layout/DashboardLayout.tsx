import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useUIStore } from '@/store/uiStore';
import { TaskModal } from '@/components/tasks/TaskModal';

export function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex">
      <Sidebar />
      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <TopNav onCreateTask={() => setTaskModalOpen(true)} />
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  );
}
