const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const CLEAN_BASE = RAW_API_URL.replace(/\/$/, '');
const API_BASE = CLEAN_BASE ? (CLEAN_BASE.endsWith('/api') ? CLEAN_BASE : `${CLEAN_BASE}/api`) : '/api';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}
