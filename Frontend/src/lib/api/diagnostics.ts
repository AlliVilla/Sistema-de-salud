import { api } from "./client"
import { ENDPOINTS } from "./endpoints"
import { Diagnostic } from "../lib/context/diagnosticsContext"

interface CreateDiagnostic {
    report_id: Number,
    description: String
}

interface Report{
    heart_rate: Number,
    temperature: Number,
    oxygenation: Number
}

interface Diagnostic {
    _id: String,
    description: String,
    hash: String,
    report_id: Report
}

interface ValidateDiagnosticResponse {
    message: String,
    integro: Boolean, 
    hashActual: String,
    hashBlockchain: String
}

interface GetDiagnosticResponse {
    diagnostics: Diagnostic[]
}

export async function getDiagnostics(): Promise<GetDiagnosticResponse>{
    return await api<GetDiagnosticResponse>(ENDPOINTS.getDiagnostics, {})
}

export async function validateDiagnostics(id: string): Promise<ValidateDiagnosticResponse> {
    return await api<ValidateDiagnosticResponse>(ENDPOINTS.validateDiagnostics(id), {})
}

export async function generateDiagnostics(report_id: string): Promise<Diagnostic> {
    return await api<Diagnostic>(ENDPOINTS.generateDiagnostics(report_id), {
        method: 'POST',
        credential: 'include'
    })
}