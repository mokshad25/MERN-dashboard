import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, getDay, addMonths, subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { taskService } from '@/services/taskService';
import { Task } from '@/types';
import { priorityConfig } from '@/utils/helpers';
import { cn } from '@/utils/cn';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data } = useQuery({
    queryKey: ['tasks', { limit: 200 }],
    queryFn: () => taskService.getTasks({ sort: 'dueDate' }),
  });

  const tasks = data?.data ?? [];
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startDay = getDay(startOfMonth(currentMonth));

  const getTasksForDay = (day: Date) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tasks by due date</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white w-32 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/20" />
          ))}
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                className={cn(
                  'min-h-[100px] p-2 border-b border-r border-gray-50 dark:border-gray-700 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30',
                  !isSameMonth(day, currentMonth) && 'opacity-40'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1.5 ml-auto',
                  isCurrentDay ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300'
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task._id}
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-md truncate font-medium',
                        priorityConfig[task.priority].color
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 pl-1.5">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
