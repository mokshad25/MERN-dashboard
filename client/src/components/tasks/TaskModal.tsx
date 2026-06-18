import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { taskService } from '@/services/taskService';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
  status: 'todo' as TaskStatus,
  dueDate: '',
  category: '',
  tags: '',
};

export function TaskModal({ open, onClose, task, defaultStatus }: TaskModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!task;
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        category: task.category,
        tags: task.tags?.join(', ') ?? '',
      });
    } else {
      setForm({ ...emptyForm, status: defaultStatus ?? 'todo' });
    }
  }, [task, defaultStatus, open]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Task>) => taskService.createTask(payload),
    onSuccess: () => { toast.success('Task created!'); invalidate(); onClose(); },
    onError: () => toast.error('Failed to create task'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Task>) => taskService.updateTask(task!._id, payload),
    onSuccess: () => { toast.success('Task updated!'); invalidate(); onClose(); },
    onError: () => toast.error('Failed to update task'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    const payload: Partial<Task> = {
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
      category: form.category || 'General',
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    isEdit ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            placeholder="Add a description..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
          />
          <Input
            label="Category"
            placeholder="e.g. Design, Dev"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          />
        </div>

        <Input
          label="Tags"
          placeholder="frontend, bug, feature (comma separated)"
          value={form.tags}
          onChange={(e) => update('tags', e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
