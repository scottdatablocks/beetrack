import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '../lib/api';
import { Metrics } from '../lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function MetricsPage() {
  const { data } = useQuery<{ data: Metrics }>({
    queryKey: ['metrics', 'decisions'],
    queryFn: () => metricsApi.getDecisions(),
  });

  const metrics = data?.data;

  const severityData = metrics?.severityDistribution
    ? [
        { name: 'Critical', value: metrics.severityDistribution.critical },
        { name: 'High', value: metrics.severityDistribution.high },
        { name: 'Medium', value: metrics.severityDistribution.medium },
        { name: 'Low', value: metrics.severityDistribution.low },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Metrics & Analytics</h2>
        <p className="mt-2 text-gray-600">
          Performance insights and decision analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm text-gray-600">Total Alerts</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {metrics?.totalAlerts || 0}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600">Total Decisions</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {metrics?.totalDecisions || 0}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm text-gray-600">Avg Decision Time</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {metrics?.avgDecisionTimeMinutes || 0}
            <span className="text-lg text-gray-500 ml-2">min</span>
          </p>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Alert Severity Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f4c734" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Decision Rate */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Decision Rate
        </h3>
        <div className="flex items-center">
          <div className="text-5xl font-bold text-gray-900">
            {metrics?.decisionRate?.toFixed(1) || 0}%
          </div>
          <p className="ml-4 text-gray-600">
            of alerts have been addressed with decisions
          </p>
        </div>
      </div>
    </div>
  );
}
