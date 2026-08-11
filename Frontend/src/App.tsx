import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'
import { useBluetooth } from './lib/bluetooth'

export default function App() {
  const {
    state: btState,
    knownDevices,
    connectedName,
    scanNewDevice,
    connectToDevice,
    loadingKnown,
    ultimaLectura,
    historial,
  } = useBluetooth()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout btState={btState} connectedName={connectedName} />}>
          <Route path="/" element={<Navigate to="/vincular" replace />} />
          <Route path="/vincular" element={
            <VincularDispositivo
              btState={btState}
              knownDevices={knownDevices}
              connectedName={connectedName}
              scanNewDevice={scanNewDevice}
              connectToDevice={connectToDevice}
              loadingKnown={loadingKnown}
            />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroPaciente />} />
          <Route path="/dashboard" element={<Dashboard lectura={ultimaLectura} historial={historial} btState={btState} connectedName={connectedName} knownDevices={knownDevices} connectToDevice={connectToDevice} scanNewDevice={scanNewDevice} />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/historial" element={<Blockchain />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
