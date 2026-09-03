export type ScreenId = "vincular" | "login" | "registro" | "dashboard" | "alertas" | "historial" | "perfil" | "admin"

export interface NavItem {
  label: string

  screen: ScreenId
}

export interface PatientProfile {
  nombre: string

  edad: string

  condiciones: string[]

  correo: string

  contrasena: string

  telefono: string

  direccion: string

  emergencia: string
}

export interface VitalsReading {
  heartRate: number

  spo2: number

  temperature: number

  syncedAt: string

  status: "sin-anomalias" | "anomalia"
}

export type AlertSeverity = "alto" | "medio" | "bajo"

export type AlertStatus = "activa" | "resuelta"

export interface Alert {
  id: string

  title: string

  severity: AlertSeverity

  status: AlertStatus

  timestamp: string

  description?: string

  aiNote?: string

  confidence?: number

  model?: string

  action?: "contactar" | "revisar"
}

export interface BlockchainEntry {
  type: string

  timestamp: string

  hash: string

  block: string

  status: "verificado" | "pendiente"
}

export type { BluetoothState, BleReading } from "./lib/bluetooth"
