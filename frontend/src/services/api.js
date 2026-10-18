const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('jwtToken') || localStorage.getItem('authToken') || '';
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let payload;
  try { payload = await response.json(); } catch { payload = null; }
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }
  // Backend wraps responses as { success, message, data, errorCode }.
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

export const teacherApi = {
  requests: () => apiRequest('/teacher/requests'),
  appointments: () => apiRequest('/teacher/appointments'),
  createAvailability: (data) => apiRequest('/teacher/availability', { method: 'POST', body: data }),
  approveRequest: (id) => apiRequest(`/teacher/requests/${id}/approve`, { method: 'PATCH' }),
  rejectRequest: (id) => apiRequest(`/teacher/requests/${id}/reject`, { method: 'PATCH' }),
  cancelAppointment: (id, reason) => apiRequest(`/teacher/appointments/${id}/cancel`, { method: 'PATCH', body: { reason } }),
  notifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
};
