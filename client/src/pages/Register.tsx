import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await authService.register(form.name, form.email, form.password);
      setAuth(res.user, res.token);
      toast.success(`Welcome to TaskFlow, ${res.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-elevated p-6">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create account</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start managing tasks like a pro</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                leftIcon={<User size={14} />}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                leftIcon={<Mail size={14} />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                leftIcon={<Lock size={14} />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                leftIcon={<Lock size={14} />}
                required
              />
              <Button type="submit" loading={loading} className="w-full h-10">
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
