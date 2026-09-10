import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import RequireAuth from './components/auth/RequireAuth'
import RequireRole from './components/auth/RequireRole'
import Landing from './pages/Landing'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'
import Confirmar from './pages/onboarding/ConfirmarEmail'
import AdminPanel from './pages/AdminPanel'
import { DiagnosticsProvider } from './lib/context/diagnosticsContext'
import BtTest from './pages/BtTest'
import { useBluetooth } from './lib/bluetooth'

export default function App() {
  const {
    state: btState,
    knownDevices,
    connectedName,
    scanNewDevice,
    connectToDevice,
    loadingKnown,
    btSupported,
    ultimaLectura,
    historial,
  } = useBluetooth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/bt-test" element={<BtTest />} />
        <Route element={<AppLayout btState={btState} connectedName={connectedName} />}>
          <Route path="/login" element={<Login btState={btState} />} />
          <Route path="/registro" element={<RegistroPaciente />} />
          <Route path='/confirmar' element={<Confirmar/>}/>

          <Route element={<RequireAuth />}>
            {/* Rutas de cliente */}
            <Route element={<DiagnosticsProvider><Outlet /></DiagnosticsProvider>}>
            <Route element={<RequireRole roles={['Client']} />}>
              <Route path="/vincular" element={
                <VincularDispositivo
                  btState={btState}
                  knownDevices={knownDevices}
                  connectedName={connectedName}
                  scanNewDevice={scanNewDevice}
                  connectToDevice={connectToDevice}
                  loadingKnown={loadingKnown}
                  btSupported={btSupported}
                />
              } />
              <Route path="/dashboard" element={<Dashboard lectura={ultimaLectura} historial={historial} btState={btState} connectedName={connectedName} knownDevices={knownDevices} connectToDevice={connectToDevice} scanNewDevice={scanNewDevice} />} />
              <Route path="/alertas" element={<Alertas />} />
              <Route path="/historial" element={<Blockchain />} />
              <Route path="/perfil" element={<Perfil connectedName={connectedName} />} />
            </Route>
            </Route>
            
            {/* Rutas de administrador */}
            <Route element={<RequireRole roles={['Admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
