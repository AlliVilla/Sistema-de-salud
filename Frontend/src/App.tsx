import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'
import type { ScreenId } from './types'

// Screen flow:
//   vincular → login → (dashboard si tiene cuenta | registro si no)
//   registro → dashboard
//   dashboard / alertas / blockchain / perfil ↔ navegable via el layout (NavBar)
export default function App() {
  const [screen, setScreen] = useState<ScreenId>('vincular')

  return (
    <AppLayout currentScreen={screen} onNavigate={setScreen}>
      {screen === 'vincular' && <VincularDispositivo onNext={() => setScreen('login')} />}
      {screen === 'login' && (
        <Login onLogin={() => setScreen('dashboard')} onCreateAccount={() => setScreen('registro')} />
      )}
      {screen === 'registro' && <RegistroPaciente onNext={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'alertas' && <Alertas />}
      {screen === 'blockchain' && <Blockchain />}
      {screen === 'perfil' && <Perfil />}
    </AppLayout>
  )
}