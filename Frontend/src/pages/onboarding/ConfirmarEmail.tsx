import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { theme } from '../../theme'
import { validateEmail } from '../../lib/api/users'
import EcgLine from "@/components/charts/EcgLine";

export default function ConfirmarEmail(){
    const navigate = useNavigate()
    const [tokenConfirmation, setTokenConfirmation] = useState("");

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const inputStyle: React.CSSProperties = {
        height: '80px',
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
        fontSize: 20,
        color: theme.colors.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 6,
    }

    const handleSubmit = async() => {
        if(!tokenConfirmation.trim()) return "El token de verificación es requerido."

        try{
            await validateEmail(tokenConfirmation.trim())
            navigate('/login')
        }catch(error){
            setError(error instanceof Error ? error.message : 'No se pudo crear la cuenta. Intenta de nuevo.')
        } finally {
        setLoading(false)
        }
    }

    return(

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <EcgLine color={theme.colors.teal} />
            <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', padding: '20px 24px 32px',}}>
            <div style={{width: '100%'}}>    
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Valida el correo de tu usuario.
            </h1>
            <p style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.6, marginBottom: 28 }}>
                Pega el token que se le mando a tu correo.                                                  
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
                <span style={labelStyle}>Token de Validación</span>
                <input value={tokenConfirmation} onChange={(e) => {setTokenConfirmation(e.target.value)}} placeholder="nxqiu73dqujhqxyw" style={inputStyle} />
                </div>
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