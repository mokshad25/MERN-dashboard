import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authService } from '@/services/authService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [profile, setProfile] = useState({ name: user?.name ?? '', avatar: user?.avatar ?? '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const profileMutation = useMutation({
    mutationFn: () => authService.updateProfile(profile),
    onSuccess: (res) => { updateUser(res.user); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to update profile'),
  });

  const passwordMutation = useMutation({
    mutationFn: () => authService.changePassword(passwords.current, passwords.next),
    onSuccess: () => { toast.success('Password changed!'); setPasswords({ current: '', next: '', confirm: '' }); },
    onError: () => toast.error('Failed to change password'),
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.next.length < 6) return toast.error('Password must be 6+ characters');
    passwordMutation.mutate();
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          {user && <Avatar name={user.name} src={profile.avatar || undefined} size="lg" />}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input label="Full Name" value={profile.name} onChange={(e) => setProfile((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Avatar URL" placeholder="https://..." value={profile.avatar} onChange={(e) => setProfile((f) => ({ ...f, avatar: e.target.value }))} />
          <Button onClick={() => profileMutation.mutate()} loading={profileMutation.isPending} size="sm">
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords((f) => ({ ...f, current: e.target.value }))} required />
          <Input label="New Password" type="password" value={passwords.next} onChange={(e) => setPasswords((f) => ({ ...f, next: e.target.value }))} required />
          <Input label="Confirm Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords((f) => ({ ...f, confirm: e.target.value }))} required />
          <Button type="submit" loading={passwordMutation.isPending} size="sm">Update Password</Button>
        </form>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Toggle dark theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </Card>
    </div>
  );
}
