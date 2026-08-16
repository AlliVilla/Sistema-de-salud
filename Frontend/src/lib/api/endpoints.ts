// Canonical route map of the Express backend. Keep it in sync with the
// backend implementation so the frontend never hard-codes URLs.
export const ENDPOINTS = {
  health: '/health',
  register: '/user/create',
  login: '/user/validate',
  vitals: '/api/vitals/latest',
  alerts: '/api/alerts',
  alertsReview: (id: string) => `/api/alerts/${id}/review`,
  patient: '/api/patient',
  blockchain: '/api/blockchain/entries',
  blockchainShare: '/api/blockchain/share',
  ollamaChat: '/api/ollama/chat',
} as const