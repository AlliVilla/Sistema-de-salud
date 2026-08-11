import { useState, useRef, useCallback, useEffect } from 'react'

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
const MAX_HISTORIAL = 30

export type BluetoothState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error'

export interface BleReading {
  temp: number | null
  hr: number
  hrValid: boolean
  spo2: number
  spo2Valid: boolean
  timestamp: string
}

const ESP32_DEVICE_IDS_KEY = 'esp32_known_ids'

function getKnownEsp32Ids(): Set<string> {
  try {
    const raw = localStorage.getItem(ESP32_DEVICE_IDS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveEsp32Id(id: string) {
  const ids = getKnownEsp32Ids()
  ids.add(id)
  localStorage.setItem(ESP32_DEVICE_IDS_KEY, JSON.stringify([...ids]))
}

export interface BleDevice {
  id: string
  name: string
  device: BluetoothDevice
}

export function useBluetooth() {
  const [state, setState] = useState<BluetoothState>('disconnected')
  const [historial, setHistorial] = useState<BleReading[]>([])
  const [ultimaLectura, setUltimaLectura] = useState<BleReading | null>(null)
  const [knownDevices, setKnownDevices] = useState<BleDevice[]>([])
  const [connectedName, setConnectedName] = useState<string | null>(null)
  const deviceRef = useRef<BluetoothDevice | null>(null)
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const connectingRef = useRef(false)

  const loadKnownDevices = useCallback(async () => {
    if (!('bluetooth' in navigator)) return
    try {
      const esp32Ids = getKnownEsp32Ids()
      const devices = await navigator.bluetooth.getDevices()
      const mapped: BleDevice[] = devices
        .filter(d => esp32Ids.has(d.id))
        .map(d => ({
          id: d.id,
          name: d.name || 'Dispositivo sin nombre',
          device: d,
        }))
      setKnownDevices(mapped)

      for (const d of devices) {
        if (d.gatt?.connected && esp32Ids.has(d.id)) {
          deviceRef.current = d
          setConnectedName(d.name || 'Dispositivo')
          setState('connected')
          return
        }
      }
    } catch {
      // getDevices() may fail if no permission yet
    }
  }, [])

  useEffect(() => {
    loadKnownDevices()
  }, [loadKnownDevices])

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
        device,
      }
      saveEsp32Id(device.id)
      setKnownDevices(prev => {
        const exists = prev.find(d => d.id === mapped.id)
        return exists ? prev : [mapped, ...prev]
      })
      setState('disconnected')
      return mapped
    } catch {
      setState('disconnected')
      return null
    }
  }, [])

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

      bleDevice.device.addEventListener('gattserverdisconnected', () => {
        setState('disconnected')
        setConnectedName(null)
        characteristicRef.current = null
        deviceRef.current = null
      })

      saveEsp32Id(bleDevice.device.id)
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

  const disconnect = useCallback(() => {
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
    ultimaLectura,
    historial,
  }
}
