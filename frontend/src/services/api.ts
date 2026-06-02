const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export class ApiError extends Error {
  status?: number
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const error = new ApiError(`API request failed: ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json() as Promise<T>
}

export { API_BASE_URL }

