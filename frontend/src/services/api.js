import axios from 'axios';

// Base API client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for clear error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.detail || error.message || 'Network error occurred';
    console.error('API Error:', errorMsg);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('hr_insight_token', response.data.access_token);
      localStorage.setItem('hr_insight_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('hr_insight_token');
    localStorage.removeItem('hr_insight_user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('hr_insight_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('hr_insight_token');
  }
};

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  }
};

export const analyticsService = {
  getOverview: async (filters = {}) => {
    const cleanFilters = {};
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        cleanFilters[k] = filters[k];
      }
    });
    const response = await apiClient.get('/analytics/overview', { params: cleanFilters });
    return response.data;
  },
  getDepartmentStats: async () => {
    const response = await apiClient.get('/analytics/department');
    return response.data;
  },
  getJobRoleStats: async () => {
    const response = await apiClient.get('/analytics/job-role');
    return response.data;
  }
};

export const predictionService = {
  predict: async (employeeData) => {
    const response = await apiClient.post('/predict', employeeData);
    return response.data;
  },
  getHistory: async (params = {}) => {
    const response = await apiClient.get('/predictions', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/predictions/${id}`);
    return response.data;
  },
  deletePrediction: async (id) => {
    const response = await apiClient.delete(`/predictions/${id}`);
    return response.data;
  }
};

export const modelService = {
  getMetrics: async () => {
    const response = await apiClient.get('/models/metrics');
    return response.data;
  },
  getComparison: async () => {
    const response = await apiClient.get('/models/comparison');
    return response.data;
  },
  getModelDetails: async (modelKey) => {
    const response = await apiClient.get(`/models/${modelKey}/details`);
    return response.data;
  },
  retrain: async () => {
    const response = await apiClient.post('/models/retrain');
    return response.data;
  }
};

export const healthService = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default apiClient;
