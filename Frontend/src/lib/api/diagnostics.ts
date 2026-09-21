import { api } from "./client"
import { ENDPOINTS } from "./endpoints"

export interface ApiReport {
  _id: string
  user_id?: string
  heart_rate: number
  temperature: number
  oxygenation: number
  createdAt?: string
}

export interface ApiDiagnostic {
  _id: string
  report_id: ApiReport | string
  hash: string
  description: string
  createdAt?: string
}

export interface Diagnostic {
  id: string
  report_id: string
  hash: string
  description: string
  createdAt?: string
}

export interface GetDiagnosticResponse {
  diagnostics: ApiDiagnostic[]
}

export interface ValidateDiagnosticResponse {
  message: string
  integro?: boolean
  hashActual?: string
  hashBlockchain?: string
  data?: {
    integro: boolean
    hashActual: string
    hashBlockchain: string
    diagnostic: ApiDiagnostic
  }
}

export interface GenerateDiagnosticResponse {
  message: string
  hash?: string
  txHash?: string
  diagnostic?: ApiDiagnostic | null
  data?: {
    diagnostic?: ApiDiagnostic | null
    blockchain?: unknown
    blockchainError?: string | null
    telegramError?: string | null
  }
}

export function normalizeDiagnostic(d: ApiDiagnostic): Diagnostic {
  const reportId =
    typeof d.report_id === "string" ? d.report_id : d.report_id?._id ?? ""
  return {
    id: d._id,
    report_id: reportId,
    hash: d.hash,
    description: d.description,
    createdAt: d.createdAt,
  }
}

export async function getDiagnostics(): Promise<GetDiagnosticResponse> {
  return await api<GetDiagnosticResponse>(ENDPOINTS.getDiagnostics, {})
}

export async function validateDiagnostics(
  id: string,
): Promise<ValidateDiagnosticResponse> {
  return await api<ValidateDiagnosticResponse>(
    ENDPOINTS.validateDiagnostics(id),
    {},
  )
}

export async function generateDiagnostics(
  report_id: string,
): Promise<GenerateDiagnosticResponse> {
  return await api<GenerateDiagnosticResponse>(
    ENDPOINTS.generateDiagnostics(report_id),
    {
      method: "POST",
      credentials: "include",
    },
  )
}
