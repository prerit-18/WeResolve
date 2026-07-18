const API_URL = 'http://localhost:8000/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, serialize it as JSON and set Content-Type
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    let errorDetail = 'API call failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return response.json();
}

export const authApi = {
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: { email, password },
  }),
  signup: (email, password, fullName, role) => apiCall('/auth/signup', {
    method: 'POST',
    body: { email, password, full_name: fullName, role },
  }),
  getMe: () => apiCall('/auth/me'),
};

export const issuesApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/issues?${query}`);
  },
  listMyReports: () => apiCall('/issues/my-reports'),
  listAvailable: () => apiCall('/issues/available'),
  create: (formData) => apiCall('/issues/', {
    method: 'POST',
    body: formData, // Requires FormData for multipart upload
  }),
};

export const tasksApi = {
  listMyTasks: () => apiCall('/tasks/my-tasks'),
  accept: (issueId) => apiCall(`/tasks/${issueId}/accept`, {
    method: 'POST',
  }),
  submitProof: (taskId, formData) => apiCall(`/tasks/${taskId}/submit`, {
    method: 'POST',
    body: formData, // Requires FormData containing after_image
  }),
};

export const adminApi = {
  getStats: () => apiCall('/admin/stats'),
  getIssuesOverTime: () => apiCall('/admin/charts/issues-over-time'),
  getCategories: () => apiCall('/admin/charts/categories'),
  getPriorities: () => apiCall('/admin/charts/priorities'),
  getVerifications: () => apiCall('/admin/verifications'),
  verify: (taskId, action) => apiCall(`/admin/verifications/${taskId}/verify?action=${action}`, {
    method: 'POST',
  }),
  getAlerts: () => apiCall('/admin/alerts'),
  getUsers: (role) => {
    const query = role ? `?role=${role}` : '';
    return apiCall(`/admin/users${query}`);
  },
};
