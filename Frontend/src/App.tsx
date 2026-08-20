import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'
import Confirmar from './pages/onboarding/ConfirmarEmail'
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
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route element={<AppLayout btState={btState} connectedName={connectedName} />}>
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
          <Route path="/login" element={<Login btState={btState} />} />
          <Route path="/registro" element={<RegistroPaciente />} />
          <Route path="/dashboard" element={<Dashboard lectura={ultimaLectura} historial={historial} btState={btState} connectedName={connectedName} knownDevices={knownDevices} connectToDevice={connectToDevice} scanNewDevice={scanNewDevice} />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/historial" element={<Blockchain />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path='/confirmar' element={<Confirmar/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
