import { useState } from 'react'
import EcgLine from '../../components/charts/EcgLine'
import { theme } from '../../theme'
import type { PatientProfile } from '../../types'

interface RegistroPacienteProps {
  onNext: () => void
}

export default function RegistroPaciente({ onNext }: RegistroPacienteProps) {
  const [form, setForm] = useState<PatientProfile>({
    nombre: '',
    edad: '',
    condicion: '',
    correo: '',
    contrasena: '',
    contacto: '',
    telefono: '',
  })

  const set = (k: keyof PatientProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: theme.colors.surface2,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.input,
    padding: '12px 14px',
    color: theme.colors.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 6,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 32px' }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Completa tu perfil médico
        </h1>
        <p style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.6, marginBottom: 28 }}>
          Tus datos se cifran y se registran en blockchain para un historial clínico seguro e inmutable.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span style={labelStyle}>Nombre completo</span>
            <input value={form.nombre} onChange={set('nombre')} placeholder="Elena Morales García" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Edad</span>
            <input value={form.edad} onChange={set('edad')} type="number" placeholder="42" style={{ ...inputStyle, width: '40%' }} />
          </div>

          <div>
            <span style={labelStyle}>Condición médica principal</span>
            <select value={form.condicion} onChange={set('condicion')} style={{ ...inputStyle, appearance: 'none' }}>
              <option value="" disabled>Seleccionar…</option>
              <option value="dm1">Diabetes tipo 1</option>
              <option value="dm2">Diabetes tipo 2</option>
              <option value="hta">Hipertensión</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <span style={labelStyle}>Correo electrónico</span>
            <input type="email" autoComplete="email" value={form.correo} onChange={set('correo')} placeholder="correo@ejemplo.com" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Contraseña</span>
            <input type="password" value={form.contrasena} onChange={set('contrasena')} placeholder="••••••••" autoComplete="current-password" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Contacto de emergencia</span>
            <input value={form.contacto} onChange={set('contacto')} placeholder="Nombre y apellido" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={form.telefono} onChange={set('telefono')} placeholder="+504 9988-7766" style={inputStyle} />
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '16px 24px 24px',
          background: theme.colors.base,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <button
          onClick={onNext}
          style={{
            width: '100%',
            background: theme.colors.teal,
            border: 'none',
            borderRadius: theme.radius.button,
            padding: '16px',
            color: '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          Guardar y continuar
        </button>
      </div>
    </div>
  )
}