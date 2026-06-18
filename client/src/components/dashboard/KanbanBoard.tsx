import { useState } from 'react';
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

interface KanbanBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onCreateInColumn?: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; label: string; color: string; darkColor: string; accent: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-600', darkColor: 'dark:bg-gray-700 dark:text-gray-300', accent: 'bg-gray-400' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700', darkColor: 'dark:bg-blue-900/40 dark:text-blue-300', accent: 'bg-blue-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700', darkColor: 'dark:bg-green-900/40 dark:text-green-300', accent: 'bg-green-500' },
];

function SortableTaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: (t: Task) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} isDragging={isDragging} />
    </div>
  );
}

export function KanbanBoard({ tasks, isLoading, onStatusChange, onEdit, onDelete, onCreateInColumn }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getColumnTasks = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetStatus = columns.find((c) => c.id === overId)?.id
      ?? tasks.find((t) => t._id === overId)?.status;

    if (targetStatus && targetStatus !== tasks.find((t) => t._id === taskId)?.status) {
      onStatusChange(taskId, targetStatus as TaskStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.id} className="space-y-3">
            <Skeleton className="h-8 w-32" />
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <SortableContext
              key={col.id}
              id={col.id}
              items={colTasks.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="flex flex-col bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-3 min-h-[400px]"
                data-column-id={col.id}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', col.accent)} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{col.label}</span>
                    <span className={cn('px-1.5 py-0.5 rounded-md text-xs font-medium', col.color, col.darkColor)}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onCreateInColumn?.(col.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Drop zone + task list */}
                <div
                  className="flex-1 space-y-2.5 min-h-24 rounded-xl transition-colors"
                  id={col.id}
                >
                  <AnimatePresence>
                    {colTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-32 text-center"
                      >
                        <p className="text-xs text-gray-400 dark:text-gray-500">Drop tasks here</p>
                      </motion.div>
                    ) : (
                      colTasks.map((task) => (
                        <SortableTaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-95">
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
