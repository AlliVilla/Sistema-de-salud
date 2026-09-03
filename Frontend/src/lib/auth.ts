const TOKEN_KEY = 'vitacare_token'

interface TokenPayload {
  sub?: string
  email?: string
  exp?: number
}

try {
  localStorage.removeItem(TOKEN_KEY)
} catch {
}

function decodePayload(token: string): TokenPayload | null {
  const body = token.split('.')[1]
  if (!body) return null

  try {
    const binary = atob(body.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload
  } catch {
    return null
  }
}

function isExpired(token: string): boolean {
  const payload = decodePayload(token)
  if (typeof payload?.exp !== 'number') return true
  return payload.exp * 1000 <= Date.now()
}

export function getToken(): string | null {
  let token: string | null
  try {
    token = sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }

  if (!token) return null
  if (isExpired(token)) {
    clearSession()
    return null
  }
  return token
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
  } catch {
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export function getSessionEmail(): string | null {
  const token = getToken()
  return token ? decodePayload(token)?.email ?? null : null
}
