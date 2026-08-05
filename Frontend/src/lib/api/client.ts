// HTTP client for the future FastAPI backend.
//
// Points to `VITE_API_URL` (default http://localhost:8000) via the Vite
// environment. Set it in a `.env.local` file, e.g.:
//
//   VITE_API_URL=http://localhost:8000
//
// Swap the `fetch` implementation for axios/ky if the team prefers it; the
// pages only depend on the `api()` helper, not on the transport.

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      ...options,
    })
  } catch (err) {
    throw new ApiError(`No se pudo conectar con el backend en ${API_BASE_URL}`, 0)
  }

  if (!res.ok) {
    throw new ApiError(`API ${res.status} ${res.statusText} en ${path}`, res.status)
  }

  return (await res.json()) as T
}