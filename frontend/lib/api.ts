const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('meetlocal_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    (error as any).status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { method: 'GET', ...options }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    request(endpoint, { method: 'DELETE', ...options }),
};

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return request(endpoint, options);
}
