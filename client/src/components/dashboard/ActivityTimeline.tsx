import { Task } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelative } from '@/utils/helpers';
import { priorityConfig, statusConfig } from '@/utils/helpers';
import { Skeleton } from '@/components/ui/Skeleton';

interface ActivityTimelineProps {
  tasks: Task[];
  isLoading: boolean;
}

export function ActivityTimeline({ tasks, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <span className="text-xs text-gray-400 dark:text-gray-500">{tasks.length} items</span>
      </CardHeader>
      {tasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tasks.map((task) => {
            const status = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            return (
              <div
                key={task._id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-sm">
                  {status.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-gray-800 dark:text-gray-100 font-medium truncate">{task.title}</p>
                    <Badge className={priority.color}>{priority.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatRelative(task.updatedAt)}</span>
                  </div>
                </div>
                {task.assignedTo && (
                  <Avatar name={task.assignedTo.name} size="xs" className="flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
