import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, FolderKanban, Trash2, Pencil } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Project } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Skeleton } from '@/components/ui/Skeleton';

const PROJECT_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export default function Projects() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; project?: Project | null }>({ open: false });
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1', status: 'active' });

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  });

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => { toast.success('Project created!'); queryClient.invalidateQueries({ queryKey: ['projects'] }); closeModal(); },
    onError: () => toast.error('Failed to create project'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...rest }: Partial<Project> & { id: string }) => projectService.updateProject(id, rest),
    onSuccess: () => { toast.success('Project updated!'); queryClient.invalidateQueries({ queryKey: ['projects'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => { toast.success('Project deleted'); queryClient.invalidateQueries({ queryKey: ['projects'] }); },
  });

  const openEdit = (project: Project) => {
    setForm({ name: project.name, description: project.description, color: project.color, status: project.status });
    setModal({ open: true, project });
  };

  const closeModal = () => {
    setModal({ open: false });
    setForm({ name: '', description: '', color: '#6366f1', status: 'active' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name required');
    if (modal.project) {
      updateMutation.mutate({ id: modal.project._id, ...form } as any);
    } else {
      createMutation.mutate(form as any);
    }
  };

  const projects = data?.data ?? [];

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{projects.length} projects</p>
        </div>
        <Button onClick={() => setModal({ open: true })} icon={<Plus size={14} />}>New Project</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">No projects yet</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first project to organize tasks</p>
          <Button className="mt-4" onClick={() => setModal({ open: true })}>Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card p-5 hover:shadow-card-hover transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: project.color + '20' }}>
                    <FolderKanban size={18} style={{ color: project.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">{project.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(project._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{project.completedCount ?? 0}/{project.taskCount ?? 0} tasks</span>
                  <span>{project.taskCount ? Math.round(((project.completedCount ?? 0) / project.taskCount) * 100) : 0}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.taskCount ? ((project.completedCount ?? 0) / project.taskCount) * 100 : 0}%` }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal.open} onClose={closeModal} title={modal.project ? 'Edit Project' : 'New Project'} size="sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Name" placeholder="My awesome project" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" rows={2} className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
          </div>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((color) => (
                <button key={color} type="button" onClick={() => setForm((f) => ({ ...f, color }))}
                  className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {modal.project ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
