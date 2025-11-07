import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { alertsApi } from '../lib/api';
import { Alert } from '../lib/types';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<{ data: Alert }>({
    queryKey: ['alert', id],
    queryFn: () => alertsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading alert details...</div>;
  }

  const alert = data?.data;

  if (!alert) {
    return <div>Alert not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/alerts" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Alerts
      </Link>

      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {alert.project?.name || 'Unknown Project'}
          </h2>
          <p className="text-gray-600">Alert ID: {alert.id.substring(0, 8)}...</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Severity</h3>
            <span className={`badge-${alert.severity}`}>
              {alert.severity?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <span className="text-lg font-semibold">{alert.status}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">ROI at Stake</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${alert.roiAtStake?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Buffer Piercing</h3>
            <p className="text-2xl font-bold text-gray-900">
              {alert.bufferPiercing ? `${(alert.bufferPiercing * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
            <p className="text-lg">{format(new Date(alert.createdAt), 'PPpp')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tenant</h3>
            <p className="text-lg">{alert.tenant?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {alert.decisions && alert.decisions.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Decision History</h3>
          <div className="space-y-3">
            {alert.decisions.map((decision) => (
              <div key={decision.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <p className="font-medium">{decision.decisionType}</p>
                <p className="text-sm text-gray-600">
                  By {decision.decidedBy} • {decision.decidedAt ? format(new Date(decision.decidedAt), 'PPpp') : 'Pending'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
