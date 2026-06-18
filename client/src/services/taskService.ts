import api from './api';
import { Task, DashboardStats, TaskFilters } from '@/types';

export const taskService = {
  getTasks: async (filters?: Partial<TaskFilters>): Promise<{ data: Task[]; total: number }> => {
    const { data } = await api.get('/tasks', { params: filters });
    return data;
  },

  getTask: async (id: string): Promise<{ data: Task }> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  createTask: async (payload: Partial<Task>): Promise<{ data: Task }> => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  updateTask: async (id: string, payload: Partial<Task>): Promise<{ data: Task }> => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: string): Promise<{ data: Task }> => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data;
  },

  getStats: async (): Promise<{ data: DashboardStats }> => {
    const { data } = await api.get('/tasks/stats');
    return data;
  },

  addComment: async (id: string, text: string) => {
    const { data } = await api.post(`/tasks/${id}/comments`, { text });
    return data;
  },
};
