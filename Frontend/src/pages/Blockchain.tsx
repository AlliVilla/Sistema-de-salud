import EcgLine from '../components/charts/EcgLine'
import { mockBlockchainEntries } from '../lib/mock'
import { theme } from '../theme'
import { useState, useEffect } from 'react'
import { getDiagnostics, validateDiagnostics } from '@/lib/api/diagnostics'

interface Report{
  heart_rate: Number,
  temperature: Number,
  oxygenation: Number
}

interface Diagnostic {
  _id: String,
  description: String,
  hash: String,
  report_id: Report
}

interface Diagnostics {
  diagnostics: Diagnostic[]
}

interface ValidateDiagnosticResponse {
    message: String,
    data?:{
      integro: Boolean, 
      hashActual: String,
      hashBlockchain: String
      diagnostic: Diagnostic
    }
}

export default function Historial() {

  const [diagnostics, setDiagnostics] = useState<Diagnostics>();
  const [validation, setValidation] = useState<Record<string, ValidateDiagnosticResponse>>({});
  
  useEffect(() => {
    const fetchDiagnostics = async() => {
      try{
        const response = await getDiagnostics();
        console.log(response)
        setDiagnostics(response)

        for(const diagnostic of response.diagnostics){
          try{
            const validationResponse = await validateDiagnostics<ValidateDiagnosticResponse>(diagnostic._id);

            console.log(validationResponse)
            
            setValidation(prev => ({
              ...prev,
              [diagnostic._id]: validationResponse
            }))
          }catch(err){
            console.error(`Error: ${err}`)
          }
        }
      }catch(err){
        console.error(`Error: ${err}`)
      }
    }
    fetchDiagnostics()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.violet} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Registro de diagnosticos
          </h1>
        </div>
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 24 }}>
          Ledger verificado · {diagnostics?.diagnostics.length} entradas
        </p>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 1, background: 'rgba(167,139,250,0.15)' }} />
          {diagnostics?.diagnostics.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: theme.colors.violet,
                    boxShadow: '0 0 8px rgba(167,139,250,0.5)',
                    border: '2px solid #0A1618',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
              <div style={{ flex: 1, background: theme.colors.surface, borderRadius: 12, border: `1px solid ${theme.colors.border}`, padding: '14px' }}>
                <span className="font-display" style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, display: 'block', marginBottom: 4 }}>
                  {d.description}
                </span>
                <span className="font-mono" style={{ fontSize: 10, color: theme.colors.muted, display: 'block', marginBottom: 10 }}>
                 {`Frec. cardíaca: ${d.report_id.heart_rate} · Temperatura corporal: ${d.report_id.temperature}°C · SpO₂: ${d.report_id.oxygenation}`}
                </span>
                <div
                  style={{
                    background: 'rgba(167,139,250,0.07)',
                    border: '1px solid rgba(167,139,250,0.18)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  { validation[d._id] && (
                    <div>
                      <span className="font-mono" style={{ fontSize: 11, color: theme.colors.violetSoft }}>{validation[d._id].message}</span>
                      {validation[d._id].message === 'El diagnostico no ha sido alterado. Integridad confirmada.' && (
                        <span
                        style={{
                          background: 'rgba(45,212,191,0.1)',
                          color: theme.colors.teal,
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 6,
                          border: '1px solid rgba(45,212,191,0.2)',
                          flexShrink: 0,
                          marginLeft: 8,
                          }}>
                          validado
                        </span>
                      )}
                      {validation[d._id].message === '¡Alerta! El diagnostico en la base de datos no coincide con la blockchain.' && (
                        <div
                        style={{display: 'flex', flexDirection: 'column'}}>
                          <span
                          style={{
                            background: 'rgba(212, 45, 45, 0.1)',
                            color: theme.colors.danger,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(212, 45, 45, 0.2)',
                            flexShrink: 0,
                            marginLeft: 8,
                            marginTop: '10px'
                            }}>
                            {`Hash actual: ${validation[d._id].data.hashActual}`}
                          </span>
                          <span
                          style={{
                            background: 'rgba(212, 45, 45, 0.1)',
                            color: theme.colors.danger,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(212, 45, 45, 0.2)',
                            flexShrink: 0,
                            marginLeft: 8,
                            marginTop: '10px'
                            }}>
                            {`Hash de la blockchain: ${validation[d._id].data.hashBlockchain}`}
                          </span>                          
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          style={{
            width: '100%',
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.button,
            padding: '15px',
            color: theme.colors.muted,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartir con médico
        </button>
      </div>
    </div>
  )
}