const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token') || localStorage.getItem('lms_token');
  const headers = {
    'Content-Type': 'application/json',
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
}

export const authApi = {
  register(payload) {
    return api.post('/auth/register', payload)
  },
  login(payloadOrEmail, password, secretCode) {
    if (typeof payloadOrEmail === 'object' && payloadOrEmail !== null) {
      return api.post('/auth/login', payloadOrEmail)
    }
    return api.post('/auth/login', {
      email: payloadOrEmail,
      password,
      secretCode,
    })
  }
}

