import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { alertsApi } from '../lib/api';
import { Alert } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function Alerts() {
  const { data, isLoading } = useQuery<{ data: Alert[] }>({
    queryKey: ['alerts'],
    queryFn: () => alertsApi.getAll({ limit: 100 }),
  });

  const getSeverityBadge = (severity?: string) => {
    const classes = {
      critical: 'badge-critical',
      high: 'badge-high',
      medium: 'badge-medium',
      low: 'badge-low',
    };
    return classes[severity as keyof typeof classes] || 'badge';
  };

  if (isLoading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Alerts</h2>
        <p className="mt-2 text-gray-600">
          All procurement constraints and delays
        </p>
      </div>

      <div className="space-y-4">
        {data?.data.map((alert) => (
          <Link
            key={alert.id}
            to={`/alerts/${alert.id}`}
            className="card hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className={getSeverityBadge(alert.severity)}>
                    {alert.severity?.toUpperCase()}
                  </span>
                  <span className="font-medium text-gray-900">
                    {alert.project?.name || 'Unknown Project'}
                  </span>
                  <span className={clsx(
                    'text-xs px-2 py-1 rounded',
                    alert.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  )}>
                    {alert.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">ROI at Stake</p>
                    <p className="text-lg font-semibold">
                      ${alert.roiAtStake?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Buffer Impact</p>
                    <p className="text-lg font-semibold">
                      {alert.bufferPiercing ? `${(alert.bufferPiercing * 100).toFixed(0)}%` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-lg font-semibold">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
