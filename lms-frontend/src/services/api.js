const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token') || localStorage.getItem('lms_token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  })

  const contentType = response.headers.get('content-type')

  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && (data?.message || data?.error)
        ? data.message || data.error
        : 'Something went wrong'

    throw new Error(message)
  }

  return data
}

export const api = {
  get(endpoint) {
    return apiRequest(endpoint, {
      method: 'GET',
    })
  },

  post(endpoint, body) {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put(endpoint, body) {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete(endpoint) {
    return apiRequest(endpoint, {
      method: 'DELETE',
    })
  },

  // For multipart/form-data uploads (e.g. content files). Don't set
  // Content-Type manually — the browser needs to add its own multipart
  // boundary, which apiRequest's default JSON header would otherwise clobber.
  upload(endpoint, formData) {
    const token = localStorage.getItem('token') || localStorage.getItem('lms_token');
    return apiRequest(endpoint, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
  },
}

export const authApi = {
  login: (email, password, secretCode) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...(secretCode ? { secretCode } : {}) }),
  }),
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
