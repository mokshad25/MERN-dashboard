import { useState } from 'react';
import { Search, Bell, Plus, Moon, Sun, Command } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TopNavProps {
  onCreateTask?: () => void;
}

export function TopNav({ onCreateTask }: TopNavProps) {
  const { user } = useAuthStore();
  const { darkMode, toggleDarkMode, setCommandPalette } = useUIStore();
  const [search, setSearch] = useState('');

  return (
    <header className="h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 px-5 sticky top-0 z-20">
      <div className="flex-1 max-w-xs">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={14} />}
          rightIcon={
            <kbd
              className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500 cursor-pointer"
              onClick={() => setCommandPalette(true)}
            >
              <Command size={10} />K
            </kbd>
          }
          className="h-8 text-xs bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
        </button>

        <Button size="sm" onClick={onCreateTask} icon={<Plus size={14} />}>
          New Task
        </Button>

        {user && <Avatar name={user.name} size="sm" className="cursor-pointer" />}
      </div>
    </header>
  );
}
