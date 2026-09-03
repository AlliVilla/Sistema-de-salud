// Canonical route map of the Express backend. Keep it in sync with the
// backend implementation so the frontend never hard-codes URLs.
export const ENDPOINTS = {
  health: '/health',
  register: '/user/create',
  login: '/user/validate',
  confirm: (token: string) => `/user/confirm-email/${token}`,
  vitals: '/api/vitals/latest',
  alerts: '/api/alerts',
  alertsReview: (id: string) => `/api/alerts/${id}/review`,
  patient: '/api/patient',
  blockchain: '/api/blockchain/entries',
  blockchainShare: '/api/blockchain/share',
  ollamaChat: '/api/ollama/chat',
  createReport: '/report/create'
} as const