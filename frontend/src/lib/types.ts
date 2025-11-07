export interface Alert {
  id: string;
  tenantId: string;
  projectId: string;
  orderLineId?: string;
  bufferPiercing?: number;
  roiAtStake?: number;
  severity?: string;
  status: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  };
  orderLine?: {
    id: string;
    partId?: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
  decisions?: Decision[];
}

export interface Decision {
  id: string;
  alertId?: string;
  decisionToken?: string;
  decisionType?: string;
  decidedAt?: string;
  decidedBy?: string;
  createdAt: string;
  alert?: Alert;
}

export interface Metrics {
  totalAlerts: number;
  totalDecisions: number;
  avgDecisionTimeMinutes: number;
  severityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  decisionRate: number;
}

export interface SystemHealth {
  totalAlerts: number;
  openAlerts: number;
  criticalAlerts: number;
  totalDecisions: number;
  recentAlerts: number;
  status: string;
}
