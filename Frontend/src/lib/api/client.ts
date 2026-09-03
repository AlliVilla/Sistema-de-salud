const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const TOKEN_STORAGE_KEY = 'auth_token' // usa la misma key donde guardas el token al hacer login

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

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
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    })
  } catch {
    throw new ApiError(`No se pudo conectar con el backend en ${API_BASE_URL}`, 0)
  }

  if (!res.ok) {
    throw new ApiError(await readErrorMessage(res), res.status)
  }

  return (await res.json()) as T
}