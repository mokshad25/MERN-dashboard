export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  category: string;
  tags: string[];
  assignedTo: User | null;
  createdBy: string;
  project: { _id: string; name: string; color: string } | null;
  comments: Comment[];
  order: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  owner: string;
  taskCount?: number;
  completedCount?: number;
  dueDate: string | null;
  createdAt: string;
}

export interface DashboardStats {
  overview: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    recentCompleted: number;
  };
  weeklyData: Array<{ _id: string; created: number; completed: number }>;
  priorityBreakdown: Array<{ _id: string; count: number }>;
  categoryBreakdown: Array<{ _id: string; count: number }>;
  recentTasks: Task[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  category: string;
  sort: string;
}
