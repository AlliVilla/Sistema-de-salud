import type { Alert, BlockchainEntry, VitalsReading } from '../types'

// Mock data so the UI works before the FastAPI backend is connected.
// Replace these imports with `api()` calls (see `lib/api`) when ready.

export const PATIENT = {
  name: 'Elena Morales',
  initials: 'EM',
  age: 42,
  condition: 'Diabetes tipo 2',
  subline: 'paciente crónico · diabetes tipo 2',
  device: 'VitaCore X2 Pro',
  deviceMac: 'BC:4F:A2:11:DE:09',
  deviceBattery: 87,
  deviceBt: 'BT 5.2',
} as const

export const mockVitals: VitalsReading = {
  heartRate: 82,
  spo2: 97,
  temperature: 37.1,
  syncedAt: 'hoy, 08:47:33',
  status: 'sin-anomalias',
}

export const mockActiveAlert: Alert = {
  id: 'al-001',
  title: 'Taquicardia detectada',
  severity: 'alto',
  status: 'activa',
  timestamp: '09:14:22',
  description:
    'Frecuencia cardíaca sostenida de 118 bpm durante 4 minutos sin actividad física registrada.',
  aiNote:
    'Patrón consistente con taquicardia supraventricular paroxística. Correlación con historial previo detectada. Se recomienda evaluación cardiológica.',
  confidence: 93.7,
  model: 'Modelo v4.2',
}

export const mockResolvedAlerts: Alert[] = [
  { id: 'al-002', title: 'SpO₂ bajo', severity: 'bajo', status: 'resuelta', timestamp: 'ayer, 22:31', description: '94% por 2 min' },
  { id: 'al-003', title: 'Temp. elevada', severity: 'bajo', status: 'resuelta', timestamp: 'hace 2 días', description: '37.8°C registrado' },
  { id: 'al-004', title: 'FC irregular', severity: 'medio', status: 'resuelta', timestamp: 'hace 4 días', description: 'Variabilidad alta' },
]

export const mockBlockchainEntries: BlockchainEntry[] = [
  { type: 'Medición vital — pack', timestamp: '2026-08-04T09:14:22Z', hash: '0x4a7fc2819e3b5d01fa83c3d9', block: '#4492801', status: 'verificado' },
  { type: 'Alerta — taquicardia', timestamp: '2026-08-04T09:14:28Z', hash: '0x9e2bd7504c112a6f8b4118af', block: '#4492802', status: 'verificado' },
  { type: 'Diagnóstico IA exportado', timestamp: '2026-08-04T09:15:01Z', hash: '0x1c8db36f204e9c1a3d5677e3', block: '#4492803', status: 'verificado' },
  { type: 'Consentimiento actualizado', timestamp: '2026-08-03T14:22:10Z', hash: '0x6fa31dce48790a25c12809b1', block: '#4492640', status: 'verificado' },
  { type: 'Sync — baseline registrada', timestamp: '2026-08-03T08:01:45Z', hash: '0xb7e10fa3928d5c61e7184c52', block: '#4492410', status: 'verificado' },
]