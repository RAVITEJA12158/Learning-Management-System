const API_BASE_URL = import.meta.env?.VITE_API_URL || '/api';

async function apiRequest(endpoint, options = {}) {
  let token = null;
  try {
    token = localStorage.getItem('lms_token') || localStorage.getItem('token');
  } catch {
    // ignore storage read errors
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && (data?.message || data?.error)
        ? data.message || data.error
        : 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

const api = {
  get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
  },
  post(endpoint, body) {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put(endpoint, body) {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
  },
  upload(endpoint, formData) {
    return apiRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};

const authApi = {
  async login(payload) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async googleLogin(payload) {
    return await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async register(payload) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async sendRegistrationOtp(payload) {
    return await apiRequest('/auth/phone/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async forgotPassword(payload) {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async resetPassword(payload) {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async verifyEmail(token) {
    return await apiRequest(`/auth/verify/${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  },
};

export { api, authApi };
