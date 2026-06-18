import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, FolderKanban, Calendar, BarChart3,
  Users, Settings, LogOut, Zap, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col z-30 shadow-sm overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="w-7 h-7 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap"
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                'group relative',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                  )}
                />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-2 flex-shrink-0">
        {user && (
          <div className={cn('flex items-center gap-2.5 px-2 py-2 rounded-xl mb-1', !sidebarCollapsed && 'hover:bg-gray-50 dark:hover:bg-gray-700')}>
            <Avatar name={user.name} size="sm" className="flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors group relative"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 transition-colors shadow-sm z-40"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
