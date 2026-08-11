import { useState, useRef, useCallback, useEffect } from 'react'

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
const MAX_HISTORIAL = 30

const STORAGE_DEVICES_KEY = 'esp32_devices'
const STORAGE_LAST_CONNECTED_KEY = 'esp32_last_connected'

export type BluetoothState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error'

export interface BleReading {
  temp: number | null
  hr: number
  hrValid: boolean
  spo2: number
  spo2Valid: boolean
  timestamp: string
}

export interface BleDevice {
  id: string
  name: string
  inRange: boolean
  device: BluetoothDevice
}

// ── localStorage helpers ──────────────────────────────────────────

interface StoredDevice {
  id: string
  name: string
}

function loadStoredDevices(): StoredDevice[] {
  try {
    const raw = localStorage.getItem(STORAGE_DEVICES_KEY)
    return raw ? (JSON.parse(raw) as StoredDevice[]) : []
  } catch {
    return []
  }
}

function saveStoredDevice(dev: StoredDevice) {
  const all = loadStoredDevices().filter(d => d.id !== dev.id)
  all.unshift(dev)
  localStorage.setItem(STORAGE_DEVICES_KEY, JSON.stringify(all))
}

function getLastConnectedId(): string | null {
  return localStorage.getItem(STORAGE_LAST_CONNECTED_KEY)
}

function setLastConnectedId(id: string | null) {
  if (id) {
    localStorage.setItem(STORAGE_LAST_CONNECTED_KEY, id)
  } else {
    localStorage.removeItem(STORAGE_LAST_CONNECTED_KEY)
  }
}

// ── hook ──────────────────────────────────────────────────────────

export function useBluetooth() {
  const [state, setState] = useState<BluetoothState>('disconnected')
  const [historial, setHistorial] = useState<BleReading[]>([])
  const [ultimaLectura, setUltimaLectura] = useState<BleReading | null>(null)
  const [knownDevices, setKnownDevices] = useState<BleDevice[]>([])
  const [connectedName, setConnectedName] = useState<string | null>(null)
  const [loadingKnown, setLoadingKnown] = useState(true)
  const deviceRef = useRef<BluetoothDevice | null>(null)
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const connectingRef = useRef(false)
  const autoReconnectAttemptedRef = useRef(false)
  const connectToDeviceRef = useRef<(device: BleDevice) => Promise<boolean>>(async () => false)

  // ── load known devices (data-only, no side effects) ─────────────

  const loadKnownDevices = useCallback(async () => {
    if (!('bluetooth' in navigator)) {
      setLoadingKnown(false)
      return
    }

    setLoadingKnown(true)
    const stored = loadStoredDevices()
    const lastId = getLastConnectedId()

    setKnownDevices(stored.map(s => ({
      id: s.id,
      name: s.name,
      inRange: false,
      device: null as unknown as BluetoothDevice,
    })))

    let devices: BluetoothDevice[] = []
    try {
      devices = await navigator.bluetooth.getDevices()
    } catch {
      // permission not granted yet
    }

    const deviceMap = new Map(devices.map(d => [d.id, d]))

    setKnownDevices(prev => prev.map(d => {
      const live = deviceMap.get(d.id)
      return live ? { ...d, inRange: true, device: live } : d
    }))

    setLoadingKnown(false)

    // Auto-reconnect: runs directly inside the async flow, not via a separate useEffect
    if (lastId && !autoReconnectAttemptedRef.current) {
      const live = deviceMap.get(lastId)
      if (live) {
        autoReconnectAttemptedRef.current = true
        const storedMeta = stored.find(s => s.id === lastId)
        const bleDevice: BleDevice = {
          id: live.id,
          name: live.name || storedMeta?.name || 'Dispositivo',
          inRange: true,
          device: live,
        }
        connectToDeviceRef.current(bleDevice)
      }
    }
  }, [])

  useEffect(() => {
    loadKnownDevices()
  }, [loadKnownDevices])

  // ── scan ────────────────────────────────────────────────────────

  const scanNewDevice = useCallback(async (): Promise<BleDevice | null> => {
    if (!('bluetooth' in navigator)) return null
    setState('scanning')
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      })
      const mapped: BleDevice = {
        id: device.id,
        name: device.name || 'Dispositivo sin nombre',
        inRange: true,
        device,
      }
      saveStoredDevice({ id: device.id, name: mapped.name })
      setKnownDevices(prev => {
        const exists = prev.find(d => d.id === mapped.id)
        return exists ? prev.map(d => d.id === mapped.id ? mapped : d) : [mapped, ...prev]
      })
      setState('disconnected')
      return mapped
    } catch {
      setState('disconnected')
      return null
    }
  }, [])

  // ── characteristic listener ─────────────────────────────────────

  const setupCharacteristicListener = useCallback((characteristic: BluetoothRemoteGATTCharacteristic) => {
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic
      if (!target.value) return
      try {
        const decoder = new TextDecoder('utf-8')
        const valor = decoder.decode(target.value)
        const datos = JSON.parse(valor)
        const lectura: BleReading = {
          temp: datos.temp ?? null,
          hr: datos.hr ?? 0,
          hrValid: datos.hrValid === 1 || datos.hrValid === true,
          spo2: datos.spo2 ?? 0,
          spo2Valid: datos.spo2Valid === 1 || datos.spo2Valid === true,
          timestamp: new Date().toISOString(),
        }
        setUltimaLectura(lectura)
        setHistorial(prev => {
          const next = [...prev, lectura]
          return next.length > MAX_HISTORIAL ? next.slice(next.length - MAX_HISTORIAL) : next
        })
      } catch (err) {
        console.error('Error procesando dato BLE:', err)
      }
    })
  }, [])

  // ── connect ─────────────────────────────────────────────────────

  const connectToDevice = useCallback(async (bleDevice: BleDevice) => {
    if (connectingRef.current) return false
    connectingRef.current = true
    setState('connecting')

    try {
      const server = await bleDevice.device.gatt!.connect()
      const service = await server.getPrimaryService(SERVICE_UUID)
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)
      characteristicRef.current = characteristic

      await characteristic.startNotifications()
      setupCharacteristicListener(characteristic)

      deviceRef.current = bleDevice.device
      setConnectedName(bleDevice.name)

      saveStoredDevice({ id: bleDevice.device.id, name: bleDevice.name })
      setLastConnectedId(bleDevice.device.id)

      bleDevice.device.addEventListener('gattserverdisconnected', () => {
        setState('disconnected')
        setConnectedName(null)
        characteristicRef.current = null
        deviceRef.current = null
      })

      setState('connected')
      connectingRef.current = false
      return true
    } catch (err) {
      console.error('Error conectando:', err)
      setState('error')
      connectingRef.current = false
      return false
    }
  }, [setupCharacteristicListener])

  // Keep the ref in sync so loadKnownDevices can call connectToDevice directly
  useEffect(() => {
    connectToDeviceRef.current = connectToDevice
  }, [connectToDevice])

  // ── disconnect ──────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    setLastConnectedId(null)
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect()
    }
  }, [])

  return {
    state,
    knownDevices,
    connectedName,
    scanNewDevice,
    connectToDevice,
    disconnect,
    loadingKnown,
    ultimaLectura,
    historial,
  }
}
