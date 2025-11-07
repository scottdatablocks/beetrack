import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const alertsApi = {
  getAll: (params?: { status?: string; limit?: number }) =>
    api.get('/api/alerts', { params }),
  getById: (id: string) => api.get(`/api/alerts/${id}`),
  getCritical: (tenantId?: string) =>
    api.get('/api/alerts/critical', { params: { tenant_id: tenantId } }),
  getByProject: (projectId: string) =>
    api.get(`/api/alerts/project/${projectId}`),
  create: (data: any) => api.post('/api/alerts', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/alerts/${id}/status`, { status }),
};

export const decisionsApi = {
  getAll: (limit?: number) =>
    api.get('/api/decisions', { params: { limit } }),
  getById: (id: string) => api.get(`/api/decisions/${id}`),
  getByToken: (token: string) => api.get(`/api/decisions/token/${token}`),
  getByAlert: (alertId: string) =>
    api.get(`/api/decisions/alert/${alertId}`),
  create: (data: any) => api.post('/api/decisions', data),
  record: (token: string, data: { action: string; user_id: string }) =>
    api.put(`/api/decisions/${token}`, data),
};

export const metricsApi = {
  getDecisions: (tenantId?: string) =>
    api.get('/api/metrics/decisions', { params: { tenant_id: tenantId } }),
  getVendors: () => api.get('/api/metrics/vendors'),
  getPMs: (tenantId?: string) =>
    api.get('/api/metrics/pms', { params: { tenant_id: tenantId } }),
  getHealth: () => api.get('/api/metrics/health'),
};
