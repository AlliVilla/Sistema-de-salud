import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EcgLine from '../../components/charts/EcgLine'
import { theme } from '../../theme'
import { registerUser } from '../../lib/api/users'
import type { PatientProfile } from '../../types'

const Condiciones = [
  { name: "Diabetes Tipo 1" },
  { name: "Diabetes Tipo 2" },
  { name: "Hipertensión" },
  { name: "Otro" }
]

export default function RegistroPaciente() {
  const navigate = useNavigate()
  const [form, setForm] = useState<PatientProfile>({
    nombre: '',
    edad: '',
    condiciones: [],
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    emergencia: '',
  })
  const [loading, setLoading] = useState(false)
  const [otroDetalle, setOtroDetalle] = useState('')
  const [otrasCondiciones, setOtrasCondiciones] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof PatientProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const addCondition = (newCondition: string) => {
    setForm((f) => {
      const conditions = f.condiciones.includes(newCondition)
      return {
        ...f, 
        condiciones: conditions ? f.condiciones.filter((c) => c!==newCondition) : [...f.condiciones, newCondition]
      }
    })
    if(newCondition === 'Otro') setOtroDetalle('')
  }

  const addOtro = () => {
    const value = otroDetalle.trim()
    if (!value) return
    setOtrasCondiciones((list) => (list.includes(value) ? list : [...list, value]))
    setOtroDetalle('')
  }

  const removeOtro = (condicion: string) =>
    setOtrasCondiciones((list) => list.filter((c) => c !== condicion))

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

  const digits = (value: string) => value.replace(/\D/g, '')

  const validate = (): string | null => {
    if (!form.nombre.trim()) return 'El nombre completo es requerido.'
    const age = Number(form.edad)
    if (!form.edad || Number.isNaN(age) || age < 0 || age > 130) return 'Ingresa una edad válida (0–130).'
    if (form.condiciones.length === 0) return 'Selecciona una condición médica.'
    if(form.condiciones.includes('Otro') && otrasCondiciones.length === 0) return 'Agrega al menos una condición médica.'
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) return 'Ingresa un correo electrónico válido.'
    if (form.contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (digits(form.telefono).length !== 8) return 'El teléfono debe contener exactamente 8 dígitos.'
    if (!form.direccion.trim()) return 'La dirección es requerida.'
    if (digits(form.emergencia).length !== 8) return 'El teléfono de emergencia debe contener exactamente 8 dígitos.'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const condicionesFinal = form.condiciones.filter((c) => c !== 'Otro')
      for (const extra of otrasCondiciones) {
        if (!condicionesFinal.includes(extra)) condicionesFinal.push(extra)
      }
      await registerUser({
        email: form.correo.trim(),
        password: form.contrasena,
        name: form.nombre.trim(),
        phone: digits(form.telefono),
        emergency_phone: digits(form.emergencia),
        address: form.direccion.trim(),
        age: Number(form.edad),
        condition: condicionesFinal,
      })
      navigate('/confirmar')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
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

        {error && (
          <div
            style={{
              marginBottom: 18,
              padding: '12px 14px',
              borderRadius: theme.radius.input,
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.35)',
              color: '#F87171',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

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
            <span style={labelStyle}>Condiciones médicas</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Condiciones.map((c) => {
                const checked = form.condiciones.includes(c.name)
                return (
                  <div>
                  <label
                    key={c.name}
                    onClick={() => addCondition(c.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: theme.radius.input,
                      border: `1px solid ${checked ? theme.colors.teal : theme.colors.border}`,
                      background: checked ? 'rgba(45,212,191,0.08)' : theme.colors.surface2,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: theme.colors.muted,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => addCondition(c.name)}
                      style={{ accentColor: theme.colors.teal, width: 16, height: 16 }}
                    />
                    {c.name}
                  </label>
                  { c.name === 'Otro' && checked && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          value={otroDetalle}
                          onChange={(e) => setOtroDetalle(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOtro() } }}
                          placeholder="Especifica una condición"
                          style={inputStyle}
                        />
                        <button
                          onClick={addOtro}
                          style={{
                            flexShrink: 0,
                            background: theme.colors.teal,
                            border: 'none',
                            borderRadius: theme.radius.button,
                            padding: '0 18px',
                            color: '#0A1618',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                          }}
                        >
                          Agregar
                        </button>
                      </div>
                      {otrasCondiciones.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {otrasCondiciones.map((cond) => (
                            <span
                              key={cond}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 12px',
                                borderRadius: 999,
                                background: 'rgba(45,212,191,0.12)',
                                border: `1px solid ${theme.colors.teal}`,
                                color: theme.colors.teal,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                              }}
                            >
                              {cond}
                              <span
                                onClick={() => removeOtro(cond)}
                                style={{
                                  cursor: 'pointer',
                                  fontWeight: 700,
                                  fontSize: 14,
                                  lineHeight: 1,
                                  color: 'rgba(45,212,191,0.8)',
                                }}
                                title="Eliminar"
                              >
                                ×
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>

          <div>
            <span style={labelStyle}>Correo electrónico</span>
            <input type="email" autoComplete="email" value={form.correo} onChange={set('correo')} placeholder="correo@ejemplo.com" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Contraseña</span>
            <input type="password" value={form.contrasena} onChange={set('contrasena')} placeholder="••••••••" autoComplete="new-password" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Teléfono</span>
            <input inputMode="numeric" value={form.telefono} onChange={set('telefono')} placeholder="9988-7766" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Dirección</span>
            <input value={form.direccion} onChange={set('direccion')} placeholder="Col. La Reforma, bloque 2, casa 14" style={inputStyle} />
          </div>

          <div>
            <span style={labelStyle}>Teléfono de emergencia(Doctor o Persona Responsable)</span>
            <input inputMode="numeric" value={form.emergencia} onChange={set('emergencia')} placeholder="9988-5566" style={inputStyle} />
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
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'rgba(45,212,191,0.15)' : theme.colors.teal,
            border: 'none',
            borderRadius: theme.radius.button,
            padding: '16px',
            color: loading ? theme.colors.teal : '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          {loading ? 'Registrando…' : 'Guardar y continuar'}
        </button>
      </div>
    </div>
  )
}