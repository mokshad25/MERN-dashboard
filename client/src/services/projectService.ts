import api from './api';
import { Project } from '@/types';

export const projectService = {
  getProjects: async (): Promise<{ data: Project[] }> => {
    const { data } = await api.get('/projects');
    return data;
  },

  createProject: async (payload: Partial<Project>): Promise<{ data: Project }> => {
    const { data } = await api.post('/projects', payload);
    return data;
  },

  updateProject: async (id: string, payload: Partial<Project>): Promise<{ data: Project }> => {
    const { data } = await api.put(`/projects/${id}`, payload);
    return data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};
