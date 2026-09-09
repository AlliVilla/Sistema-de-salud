import { api } from "./client"
import { ENDPOINTS } from "./endpoints"

interface CreateReport {
  heart_rate: number, 
  temperature: number,
  oxygenation: number
}

interface Report {
  id: string,
  user_id: string,
  heart_rate: number, 
  temperature: number,
  oxygenation: number
  createdAt: string
}

interface ReportResponse {
  message: string,
  report: Report
}

export async function registerReport(payload: CreateReport): Promise<ReportResponse> {
  return await api<ReportResponse>(ENDPOINTS.createReport, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}