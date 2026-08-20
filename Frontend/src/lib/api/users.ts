import { api } from './client'
import { ENDPOINTS } from './endpoints'

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
  condition: string
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
  condition: string
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

export async function registerUser(payload: RegisterPayload): Promise<UserResponse> {
  const res = await api<RegisterResponse>(ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.user
}

export async function loginUser(email: string, password: string): Promise<ValidateResponse> {
  return api<ValidateResponse>(ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function validateEmail(token: string): Promise<ConfirmationResponse>{
  return api<ConfirmationResponse>(ENDPOINTS.confirm(token), {})
}