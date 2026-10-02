const API_URL = import.meta.env.VITE_API_URL || '';

async function request(url, options = {}) {
  let token = null;
  try {
    token = localStorage.getItem('sqizzy_admin_token');
  } catch (e) {
    // Ignore localStorage access issues
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include', // Include HTTP-only cookie
  };

  const res = await fetch(`${API_URL}${url}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `HTTP error ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Products
export const getProducts = async () => {
  return request('/api/products');
};

export const getProductBySlug = async (slug) => {
  return request(`/api/products/${slug}`);
};

// Public Forms
export const joinWaitlist = async (formData) => {
  return request('/api/waitlist', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};

export const submitFeedback = async (formData) => {
  return request('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};

export const submitContact = async (formData) => {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};

// Admin Authentication
export const loginAdmin = async (password) => {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
};

export const logoutAdmin = async () => {
  return request('/api/admin/logout', {
    method: 'POST'
  });
};

export const checkAdminSession = async () => {
  return request('/api/admin/session');
};

// Admin Analytics APIs
export const getAdminOverview = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/overview?${query}`);
};

export const getAdminTraffic = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/traffic?${query}`);
};

export const getAdminFunnel = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/funnel?${query}`);
};

export const getAdminProducts = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/products?${query}`);
};

export const getAdminSources = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/sources?${query}`);
};

export const getAdminDevices = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/devices?${query}`);
};

export const getAdminGeo = async (range = '7d', start, end) => {
  const query = new URLSearchParams({ range, ...(start && { start }), ...(end && { end }) }).toString();
  return request(`/api/analytics/geo?${query}`);
};

export const getAdminWaitlist = async () => {
  return request('/api/analytics/waitlist');
};

export const getAdminFeedback = async () => {
  return request('/api/analytics/feedback');
};
