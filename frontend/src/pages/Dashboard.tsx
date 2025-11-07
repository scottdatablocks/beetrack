import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { alertsApi, metricsApi } from '../lib/api';
import { Alert, SystemHealth } from '../lib/types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { data: criticalAlerts } = useQuery<{ data: Alert[] }>({
    queryKey: ['alerts', 'critical'],
    queryFn: () => alertsApi.getCritical(),
  });

  const { data: healthData } = useQuery<{ data: SystemHealth }>({
    queryKey: ['metrics', 'health'],
    queryFn: () => metricsApi.getHealth(),
  });

  const health = healthData?.data;

  const stats = [
    {
      name: 'Open Alerts',
      value: health?.openAlerts || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      name: 'Critical',
      value: health?.criticalAlerts || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      name: 'Total Decisions',
      value: health?.totalDecisions || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      name: 'Recent (24h)',
      value: health?.recentAlerts || 0,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Real-time overview of procurement constraints and decisions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={clsx('p-3 rounded-lg', stat.bg)}>
                  <Icon className={clsx('h-6 w-6', stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Critical Alerts
          </h3>
          <Link to="/alerts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {criticalAlerts?.data && criticalAlerts.data.length > 0 ? (
          <div className="space-y-4">
            {criticalAlerts.data.slice(0, 5).map((alert) => (
              <Link
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="badge-critical">CRITICAL</span>
                      <span className="ml-3 text-sm text-gray-500">
                        {alert.project?.name || 'Unknown Project'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">ROI at Stake</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${alert.roiAtStake?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Buffer Impact</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {alert.bufferPiercing
                            ? `${(alert.bufferPiercing * 100).toFixed(0)}%`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {formatDistanceToNow(new Date(alert.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-gray-600">No critical alerts at the moment</p>
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          System Health
        </h3>
        <div className="flex items-center">
          <div className={clsx(
            'h-4 w-4 rounded-full mr-3',
            health?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
          )}></div>
          <span className="text-lg font-medium">
            {health?.status === 'healthy' ? 'All Systems Operational' : 'Attention Needed'}
          </span>
        </div>
      </div>
    </div>
  );
}
