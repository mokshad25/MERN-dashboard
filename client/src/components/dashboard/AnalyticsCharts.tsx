import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format } from 'date-fns';
import { DashboardStats } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useUIStore } from '@/store/uiStore';

interface AnalyticsChartsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-elevated px-3 py-2 text-xs">
      <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AnalyticsCharts({ stats, isLoading }: AnalyticsChartsProps) {
  const { darkMode } = useUIStore();

  const axisTickColor = darkMode ? '#6b7280' : '#9ca3af';
  const gridStrokeColor = darkMode ? '#374151' : '#f1f5f9';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64">
            <Skeleton className="h-full w-full" />
          </Card>
        ))}
      </div>
    );
  }

  const weeklyData = (stats?.weeklyData ?? []).map((d) => ({
    ...d,
    date: format(new Date(d._id), 'EEE'),
  }));

  const priorityData = (stats?.priorityBreakdown ?? []).map((d) => ({
    name: d._id,
    value: d.count,
    color: PRIORITY_COLORS[d._id] ?? '#6366f1',
  }));

  const categoryData = (stats?.categoryBreakdown ?? []).slice(0, 6).map((d, i) => ({
    name: d._id,
    tasks: d.count,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line chart - completion trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Task Completion Trend</CardTitle>
          <span className="text-xs text-gray-400 dark:text-gray-500">Last 7 days</span>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisTickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisTickColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: axisTickColor }} />
            <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Created" />
            <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Donut chart - priority */}
      <Card>
        <CardHeader>
          <CardTitle>By Priority</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {priorityData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val, name) => [val, name]} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: axisTickColor }}
              formatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar chart - categories */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Tasks by Category</CardTitle>
          <span className="text-xs text-gray-400 dark:text-gray-500">All time</span>
        </CardHeader>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={categoryData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisTickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisTickColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="tasks" radius={[6, 6, 0, 0]} name="Tasks">
              {categoryData.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
