export function getEsp32BaseUrl(): string {
  if (import.meta.env.VITE_ESP32_URL) return import.meta.env.VITE_ESP32_URL
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:3000`
  }
  return 'http://localhost:3000'
}

const ESP32_BASE_URL = getEsp32BaseUrl()

export interface EspRawReading {
  temp: number | null
  hr: number
  hrValid: number
  spo2: number
  spo2Valid: number
  timestamp: string | null
}

export interface EspDataResponse {
  ultima: EspRawReading
  historial: EspRawReading[]
}

export async function fetchVitals(): Promise<VitalsReading | null> {
  try {
    const res = await fetch(`${ESP32_BASE_URL}/data`)
    if (!res.ok) return null
    const json = (await res.json()) as EspDataResponse
    const { temp, hr, hrValid, spo2, spo2Valid, timestamp } = json.ultima

    const heartRate = hrValid ? hr : 0
    const spo2Val = spo2Valid ? spo2 : 0
    const temperature = temp ?? 0
    const isAnomaly = (hrValid && hr > 100) || (spo2Valid && spo2 < 90) || (temp !== null && temp > 38)

    return {
      heartRate,
      spo2: spo2Val,
      temperature,
      syncedAt: timestamp ?? new Date().toISOString(),
      status: isAnomaly ? 'anomalia' : 'sin-anomalias',
    }
  } catch {
    return null
  }
}
