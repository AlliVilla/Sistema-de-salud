import { api } from './client'
import { ENDPOINTS } from './endpoints'

// API de administración de usuarios (Backend: `/user/admin/*`).
// Solo usuarios con rol 'Admin' pueden llamar estas funciones.

export interface AdminUser {
  _id: string
  email: string
  name: string
  role: 'Admin' | 'Client'
  status: boolean
  emailConfirmation: boolean
  createdAt?: string
  updatedAt?: string
}

interface AdminListResponse {
  users: AdminUser[]
}

interface AdminUserResponse {
  user: AdminUser
}

interface AdminMessageResponse {
  message: string
  result?: boolean
}

export async function adminListUsers(): Promise<AdminUser[]> {
  const res = await api<AdminListResponse>(ENDPOINTS.adminUsers)
  return res.users
}

export async function adminGetUser(id: string): Promise<AdminUser> {
  const res = await api<AdminUserResponse>(ENDPOINTS.adminGetUser(id))
  return res.user
}

export async function adminUpdateUserRole(id: string, role: 'Admin' | 'Client'): Promise<AdminUser> {
  const res = await api<AdminUserResponse>(ENDPOINTS.adminUpdateRole(id), {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  return res.user
}

export async function adminUpdateUserStatus(id: string, status: boolean): Promise<AdminUser> {
  const res = await api<AdminUserResponse>(ENDPOINTS.adminUpdateStatus(id), {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return res.user
}

export async function adminDeleteUser(id: string): Promise<void> {
  await api<AdminMessageResponse>(ENDPOINTS.adminDeleteUser(id), {
    method: 'DELETE',
  })
}
