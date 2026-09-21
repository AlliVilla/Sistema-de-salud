// lib/context/DiagnosticsContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import {
  getDiagnostics,
  normalizeDiagnostic,
  type Diagnostic,
} from "../api/diagnostics"
import { ApiError, getToken } from "../api/client"

export type { Diagnostic } from "../api/diagnostics"

interface DiagnosticsContextValue {
  diagnostics: Diagnostic[]
  loading: boolean
  error: string | null
  addDiagnostic: (d: Diagnostic) => void
  refresh: () => Promise<void>
}

const DiagnosticsContext = createContext<DiagnosticsContextValue | null>(null)

export function DiagnosticsProvider({ children }: { children: ReactNode }) {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const byDateDesc = (a: Diagnostic, b: Diagnostic) =>
  new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()

  const addDiagnostic = useCallback((d: Diagnostic) => {
    setDiagnostics((prev) =>
      prev.some((x) => x.id === d.id) ? prev : [d, ...prev].sort(byDateDesc),
    )
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setDiagnostics([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await getDiagnostics()
      const list = (response.diagnostics ?? []).map(normalizeDiagnostic)
      setDiagnostics((prev) => {
        const ids = new Set(list.map((d) => d.id))
        const local = prev.filter((d) => !ids.has(d.id))
        return [...list, ...local.sort(byDateDesc)]
      })
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setDiagnostics([])
      } else {
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar los diagnósticos",
        )
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <DiagnosticsContext.Provider
      value={{ diagnostics, loading, error, addDiagnostic, refresh }}
    >
      {children}
    </DiagnosticsContext.Provider>
  )
}

export function useDiagnostics() {
  const ctx = useContext(DiagnosticsContext)
  if (!ctx) throw new Error("useDiagnostics debe usarse dentro de DiagnosticsProvider")
  return ctx
}
