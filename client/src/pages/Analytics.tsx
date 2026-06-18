import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { KPICards } from '@/components/dashboard/KPICards';

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: taskService.getStats,
  });

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track your productivity and task trends</p>
      </div>
      <KPICards stats={data?.data} isLoading={isLoading} />
      <AnalyticsCharts stats={data?.data} isLoading={isLoading} />
    </div>
  );
}
