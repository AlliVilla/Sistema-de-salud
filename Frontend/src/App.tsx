import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import VincularDispositivo from './pages/onboarding/VincularDispositivo'
import Login from './pages/onboarding/Login'
import RegistroPaciente from './pages/onboarding/RegistroPaciente'
import Dashboard from './pages/Dashboard'
import Alertas from './pages/Alertas'
import Blockchain from './pages/Blockchain'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/vincular" replace />} />
          <Route path="/vincular" element={<VincularDispositivo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroPaciente />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/historial" element={<Blockchain />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
