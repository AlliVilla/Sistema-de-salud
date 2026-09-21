import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { theme } from "../theme"
import { clearSession } from "../lib/auth"
import {
  adminListUsers,
  adminUpdateUserRole,
  adminUpdateUserStatus,
  adminDeleteUser,
  type AdminUser,
} from "../lib/api/admin"

type Filter = "todos" | "Client" | "Admin"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "Client", label: "Clientes" },
  { key: "Admin", label: "Administradores" },
]

export default function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("todos")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleLogout = () => {
    clearSession()
    navigate("/login", { replace: true })
  }

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await adminListUsers()
      setUsers(list)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar los usuarios.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = users.filter(
    (u) => filter === "todos" || u.role === filter,
  )

  const handleToggleRole = async (user: AdminUser) => {
    const nextRole = user.role === "Admin" ? "Client" : "Admin"
    setUpdatingId(user._id)
    setError(null)
    try {
      const updated = await adminUpdateUserRole(user._id, nextRole)
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el rol.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleToggleStatus = async (user: AdminUser) => {
    setUpdatingId(user._id)
    setError(null)
    try {
      const updated = await adminUpdateUserStatus(user._id, !user.status)
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo actualizar el estado.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (user: AdminUser) => {
    setUpdatingId(user._id)
    setError(null)
    try {
      await adminDeleteUser(user._id)
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
      setConfirmDeleteId(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo eliminar el usuario.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const statCards = [
    { label: "Total usuarios", value: users.length, color: theme.colors.teal },
    {
      label: "Clientes",
      value: users.filter((u) => u.role === "Client").length,
      color: theme.colors.amber,
    },
    {
      label: "Administradores",
      value: users.filter((u) => u.role === "Admin").length,
      color: theme.colors.violet,
    },
    {
      label: "Activos",
      value: users.filter((u) => u.status).length,
      color: theme.colors.green,
    },
  ]

  return (
    <div className="h-full w-full overflow-y-auto">
      <div style={{ padding: "20px 20px 40px" }}>
        {/* Encabezado */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 6,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: theme.colors.text,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Administración
            </h1>
            <p
              style={{
                fontSize: 13,
                color: theme.colors.muted,
                lineHeight: 1.6,
              }}
            >
              Gestiona los usuarios y sus roles. No tienes acceso a los datos de
              salud de los clientes.
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 10,
              padding: "9px 14px",
              color: "#F87171",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: theme.radius.input,
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.35)",
              color: "#F87171",
              fontSize: 13,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {statCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.borderMuted}`,
                borderRadius: theme.radius.card,
                padding: "16px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: theme.colors.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                {s.label}
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background:
                  filter === f.key ? theme.colors.teal : theme.colors.surface,
                border:
                  filter === f.key
                    ? "none"
                    : `1px solid ${theme.colors.borderMuted}`,
                borderRadius: 20,
                padding: "7px 14px",
                color: filter === f.key ? "#0A1618" : theme.colors.muted,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de usuarios */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 13, color: theme.colors.muted }}>
              Cargando usuarios…
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.borderMuted}`,
              borderRadius: theme.radius.card,
              padding: "32px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 14, color: theme.colors.muted }}>
              No hay usuarios para este filtro.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredUsers.map((user) => {
              const isUpdating = updatingId === user._id
              return (
                <div
                  key={user._id}
                  style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.borderMuted}`,
                    borderRadius: theme.radius.card,
                    padding: "16px",
                    opacity: isUpdating ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: theme.colors.text,
                            marginBottom: 2,
                          }}
                        >
                          {user.name}
                        </p>
                        <span
                          style={{
                            background:
                              user.role === "Admin"
                                ? "rgba(167,139,250,0.15)"
                                : "rgba(45,212,191,0.12)",
                            color:
                              user.role === "Admin"
                                ? theme.colors.violet
                                : theme.colors.teal,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 20,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {user.role}
                        </span>
                        <span
                          style={{
                            background: user.status
                              ? "rgba(52,211,153,0.12)"
                              : "rgba(244,63,94,0.12)",
                            color: user.status ? theme.colors.green : "#F87171",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 20,
                          }}
                        >
                          {user.status ? "activo" : "inactivo"}
                        </span>
                      </div>
                      <p
                        className="font-mono"
                        style={{ fontSize: 11, color: theme.colors.muted }}
                      >
                        {user.email}
                        {!user.emailConfirmation && (
                          <span style={{ color: theme.colors.amber }}>
                            {" "}
                            · email sin confirmar
                          </span>
                        )}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={isUpdating}
                        style={{
                          background: "transparent",
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: 10,
                          padding: "8px 12px",
                          color:
                            user.role === "Admin"
                              ? "#F87171"
                              : theme.colors.teal,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        title={
                          user.role === "Admin"
                            ? "Cambiar a cliente"
                            : "Cambiar a administrador"
                        }
                      >
                        {user.role === "Admin" ? "Quitar admin" : "Hacer admin"}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={isUpdating}
                        style={{
                          background: "transparent",
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: 10,
                          padding: "8px 12px",
                          color: user.status ? "#F87171" : theme.colors.green,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        title={
                          user.status ? "Desactivar cuenta" : "Activar cuenta"
                        }
                      >
                        {user.status ? "Desactivar" : "Activar"}
                      </button>

                      {confirmDeleteId === user._id ? (
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isUpdating}
                          style={{
                            background: theme.colors.danger,
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 12px",
                            color: "#fff",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          ¿Eliminar?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(user._id)}
                          disabled={isUpdating}
                          style={{
                            background: "transparent",
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: 10,
                            padding: "8px 12px",
                            color: theme.colors.muted,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="Eliminar usuario"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={loadUsers}
            style={{
              background: "transparent",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 10,
              padding: "10px 20px",
              color: theme.colors.muted,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Actualizar lista
          </button>
        </div>
      </div>
    </div>
  )
}
