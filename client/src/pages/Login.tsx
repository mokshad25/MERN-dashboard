import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form.email, form.password);
      setAuth(res.user, res.token);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@taskflow.app', password: 'demo123' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-elevated p-6">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                leftIcon={<Mail size={14} />}
                required
              />
              <Input
                id="password"
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                leftIcon={<Lock size={14} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between text-xs">
                <button type="button" className="text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</button>
              </div>

              <Button type="submit" loading={loading} className="w-full h-10">
                Sign in
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-gray-800 text-xs text-gray-400 dark:text-gray-500">or try demo</span></div>
            </div>

            <Button variant="outline" className="w-full h-9" onClick={fillDemo}>
              Use demo account
            </Button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
