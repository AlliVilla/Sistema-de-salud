/**
 * Middleware de control de acceso basado en roles (RBAC).
 *
 * Uso:
 *   router.get('/admin/ruta', authMiddleware, requireRole('Admin'), controller)
 *
 * El payload del JWT DEBE contener el campo `role`.
 * El middleware asume que `authMiddleware` ya ejecutó antes y populó `req.user`.
 */

const ROLES = {
  ADMIN: 'Admin',
  CLIENT: 'Client',
}

/**
 * Retorna un middleware que verifica que el usuario autenticado tenga
 * al menos uno de los roles permitidos.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: 'Acceso denegado. El token no contiene información de rol.',
        result: false,
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Acceso denegado. No tienes permisos para acceder a este recurso.',
        result: false,
      })
    }

    next()
  }
}

/**
 * Middleware que bloquea el acceso a administradores.
 * Útil para rutas que solo clientes deben usar (ej. perfil, reportes).
 */
export function requireClient(req, res, next) {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return res.status(403).json({
      message: 'Acceso denegado. Los administradores no pueden acceder a este recurso.',
      result: false,
    })
  }
  next()
}

export { ROLES }
