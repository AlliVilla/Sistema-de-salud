import { api } from "./client"
import { ENDPOINTS } from "./endpoints"

// Auth service. These types mirror the Express backend contract
// (`POST /user/create` and `POST /user/validate`).

export interface RegisterPayload {
  email: string
  password: string
  name: string
  phone: string
  emergency_phone: string
  address: string
  age: number
  condition: string[]
}

export interface UserResponse {
  id: string
  email: string
  name: string
  phone: string
  emergency_phone: string
  address: string
  status: boolean
  age: number
  condition: string[]
  telegramChatId?: string | null
}

interface TelegramLinkResponse {
  message: string
  telegramUrl: string
}

interface RegisterResponse {
  message: string
  user: UserResponse
}

interface ValidateResponse {
  message: string
  email: string
  token: string
  result: boolean
}

interface ConfirmationResponse {
  message: string
  result: boolean
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<UserResponse> {
  const res = await api<RegisterResponse>(ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return res.user
}

export async function loginUser(
  email: string,
  password: string,
): Promise<ValidateResponse> {
  return api<ValidateResponse>(ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(): Promise<UserResponse> {
  const res = await api<{ user: UserResponse & { _id?: string } }>(
    ENDPOINTS.me,
    {},
  )
  return {
    ...res.user,
    id: res.user.id ?? res.user._id ?? "",
  }
}

export async function validateEmail(
  token: string,
): Promise<ConfirmationResponse> {
  return api<ConfirmationResponse>(ENDPOINTS.confirm(token), {})
}

// Genera un enlace de vinculación de Telegram para el usuario autenticado.
// Cada llamada regenera el token en el backend e invalida el enlace anterior,
// por lo que solo debe invocarse al pulsar "Conectar Telegram".
export async function getTelegramLink(): Promise<string> {
  const res = await api<TelegramLinkResponse>(ENDPOINTS.telegramLink, {})
  return res.telegramUrl
}
