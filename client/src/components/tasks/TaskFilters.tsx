import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TaskFilters as Filters } from '@/types';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const defaultFilters: Filters = {
  search: '', status: 'all', priority: 'all', category: '', sort: '-createdAt',
};

const hasActiveFilters = (f: Filters) =>
  f.search || f.status !== 'all' || f.priority !== 'all' || f.category || f.sort !== '-createdAt';

export function TaskFiltersBar({ filters, onChange }: TaskFiltersProps) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });
  const reset = () => onChange(defaultFilters);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          leftIcon={<Search size={14} />}
          className="h-8 text-xs"
        />
      </div>
      <Select
        value={filters.status}
        onChange={(e) => set('status', e.target.value)}
        className="h-8 text-xs w-32"
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </Select>
      <Select
        value={filters.priority}
        onChange={(e) => set('priority', e.target.value)}
        className="h-8 text-xs w-32"
      >
        <option value="all">All Priority</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </Select>
      <Select
        value={filters.sort}
        onChange={(e) => set('sort', e.target.value)}
        className="h-8 text-xs w-36"
      >
        <option value="-createdAt">Newest First</option>
        <option value="createdAt">Oldest First</option>
        <option value="dueDate">Due Date</option>
        <option value="-priority">Priority</option>
      </Select>
      {hasActiveFilters(filters) && (
        <Button variant="ghost" size="sm" onClick={reset} icon={<X size={12} />}>
          Clear
        </Button>
      )}
    </div>
  );
}
