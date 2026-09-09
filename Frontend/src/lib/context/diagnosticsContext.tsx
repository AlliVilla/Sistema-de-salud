// lib/context/DiagnosticsContext.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Diagnostic {
  id: string
  report_id: string
  hash: string
  description: string
  createdAt?: string
}

interface DiagnosticsContextValue {
  diagnostics: Diagnostic[]
  addDiagnostic: (d: Diagnostic) => void
}

const DiagnosticsContext = createContext<DiagnosticsContextValue | null>(null)

export function DiagnosticsProvider({ children }: { children: ReactNode }) {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])

  const addDiagnostic = useCallback((d: Diagnostic) => {
    setDiagnostics((prev) => (prev.some((x) => x.id === d.id) ? prev : [d, ...prev]))
  }, [])

  return (
    <DiagnosticsContext.Provider value={{ diagnostics, addDiagnostic }}>
      {children}
    </DiagnosticsContext.Provider>
  )
}

export function useDiagnostics() {
  const ctx = useContext(DiagnosticsContext)
  if (!ctx) throw new Error('useDiagnostics debe usarse dentro de DiagnosticsProvider')
  return ctx
}