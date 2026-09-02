// HTTP client for the Express backend in `backend/`.
//
// Points to `VITE_API_URL` (default http://localhost:3000) via the Vite
// environment. Set it in a `.env.local` file, e.g.:
//
//   VITE_API_URL=http://localhost:3000
//
// Swap the `fetch` implementation for axios/ky if the team prefers it; the
// pages only depend on the `api()` helper, not on the transport.

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return `API ${res.status} ${res.statusText}`

  try {
    const parsed = JSON.parse(text) as unknown
    const candidate = (parsed as Record<string, unknown>).message
    if (typeof candidate === 'string') return candidate
  } catch {
    // not JSON – return the raw body
  }

  return text
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    })
  } catch {
    throw new ApiError(`No se pudo conectar con el backend en ${API_BASE_URL}`, 0)
  }

  if (res.status === 401 && token) {
    clearSession()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }

  if (!res.ok) {
    throw new ApiError(await readErrorMessage(res), res.status)
  }

  return (await res.json()) as T
}
