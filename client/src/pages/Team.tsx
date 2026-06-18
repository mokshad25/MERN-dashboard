import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function Team() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Team</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your team members</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user && (
          <Card className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                <Badge variant="info">{user.role}</Badge>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{user.email}</p>
              <p className="text-xs text-green-500 mt-1 font-medium">● Online</p>
            </div>
          </Card>
        )}
        {[
          { name: 'Sarah Connor', email: 'sarah@taskflow.app', role: 'Designer' },
          { name: 'James Wilson', email: 'james@taskflow.app', role: 'Developer' },
        ].map((member) => (
          <Card key={member.email} className="flex items-center gap-4 opacity-60">
            <Avatar name={member.name} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{member.email}</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{member.role}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-900/50 rounded-2xl p-5 text-center">
        <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Team collaboration is coming soon</p>
        <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">Invite members and assign tasks together</p>
      </div>
    </div>
  );
}
