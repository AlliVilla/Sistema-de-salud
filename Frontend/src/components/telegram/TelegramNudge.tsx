import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTelegram } from "../../lib/context/telegramContext"
import TelegramIcon from "../shared/TelegramIcon"

const NUDGE_KEY = "telegram_nudge_shown"

export default function TelegramNudge() {
  const { telegramChatId, loading } = useTelegram()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading || telegramChatId) return
    try {
      if (sessionStorage.getItem(NUDGE_KEY)) return
      sessionStorage.setItem(NUDGE_KEY, "1")
    } catch {
      return
    }
    setVisible(true)
  }, [loading, telegramChatId])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 12000)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Aviso de Telegram"
      className="fixed bottom-24 left-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0"
      style={{
        background: "#101F22",
        border: "1px solid rgba(255,180,84,0.35)",
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span
          style={{
            color: "#FFB454",
            flexShrink: 0,
            display: "flex",
            marginTop: 2,
          }}
        >
          <TelegramIcon size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#EAF2F1",
              marginBottom: 4,
            }}
          >
            Activa tus alertas de Telegram
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#7FA09C",
              lineHeight: 1.5,
              marginBottom: 10,
            }}
          >
            Vincula tu cuenta para recibir avisos cuando se genere un
            diagnóstico.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setVisible(false)
                navigate("/perfil#telegram")
              }}
              style={{
                background: "#FFB454",
                border: "none",
                borderRadius: 8,
                padding: "7px 12px",
                color: "#0A1618",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Vincular ahora
            </button>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: "none",
                border: "1px solid #283E42",
                borderRadius: 8,
                padding: "7px 12px",
                color: "#7FA09C",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Más tarde
            </button>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Cerrar"
          style={{
            background: "none",
            border: "none",
            color: "#7FA09C",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            fontSize: 16,
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}
