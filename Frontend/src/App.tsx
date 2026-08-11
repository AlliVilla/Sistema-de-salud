import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'
import { useBluetooth } from './lib/bluetooth'
import type { ScreenId } from './types'

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('vincular')
  const {
    state: btState,
    knownDevices,
    connectedName,
    scanNewDevice,
    connectToDevice,
    ultimaLectura,
    historial,
  } = useBluetooth()

  return (
    <AppLayout currentScreen={screen} onNavigate={setScreen}>
      {screen === 'vincular' && (
        <VincularDispositivo
          onNext={() => setScreen('login')}
          btState={btState}
          knownDevices={knownDevices}
          connectedName={connectedName}
          scanNewDevice={scanNewDevice}
          connectToDevice={connectToDevice}
        />
      )}
      {screen === 'login' && (
        <Login onLogin={() => setScreen('dashboard')} onCreateAccount={() => setScreen('registro')} />
      )}
      {screen === 'registro' && <RegistroPaciente onNext={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard lectura={ultimaLectura} historial={historial} />}
      {screen === 'alertas' && <Alertas />}
      {screen === 'blockchain' && <Blockchain />}
      {screen === 'perfil' && <Perfil />}
    </AppLayout>
  )
}
