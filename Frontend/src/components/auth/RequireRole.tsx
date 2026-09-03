import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getSessionRole } from '../../lib/auth'
import type { UserRole } from '../../lib/auth'

interface RequireRoleProps {
  roles: UserRole[]
}

/**
 * Guard de rutas basado en roles (RBAC).
 * - Requiere que el usuario esté autenticado (redirige a /login si no).
 * - Verifica que el rol del usuario esté entre los permitidos.
 * - Si el usuario no tiene el rol, redirige a su zona correspondiente:
 *   admins → /admin, clientes → /dashboard.
 */
export default function RequireRole({ roles }: RequireRoleProps) {
  const location = useLocation()
  const role = getSessionRole()

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!roles.includes(role)) {
    return <Navigate to={role === 'Admin' ? '/admin' : '/login'} replace />
  }

  return <Outlet />
}
