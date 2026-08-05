// Canonical route map of the future FastAPI backend. Keep it in sync with the
// backend implementation so the frontend never hard-codes URLs.
export const ENDPOINTS = {
  health: '/health',
  vitals: '/api/vitals/latest',
  alerts: '/api/alerts',
  alertsReview: (id: string) => `/api/alerts/${id}/review`,
  patient: '/api/patient',
  blockchain: '/api/blockchain/entries',
  blockchainShare: '/api/blockchain/share',
  ollamaChat: '/api/ollama/chat',
} as const