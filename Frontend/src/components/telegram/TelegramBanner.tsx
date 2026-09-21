import { useNavigate } from "react-router-dom"
import { useTelegram } from "../../lib/context/telegramContext"
import TelegramIcon from "../shared/TelegramIcon"

export default function TelegramBanner() {
  const { telegramChatId, loading } = useTelegram()
  const navigate = useNavigate()

  if (loading || telegramChatId) return null

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "rgba(255,180,84,0.08)",
        borderBottom: "1px solid rgba(255,180,84,0.25)",
      }}
    >
      <span style={{ color: "#FFB454", flexShrink: 0, display: "flex" }}>
        <TelegramIcon size={18} />
      </span>
      <p
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 13,
          color: "#EAF2F1",
          lineHeight: 1.4,
        }}
      >
        Aún no vinculas Telegram. No recibirás alertas de diagnósticos.
      </p>
      <button
        onClick={() => navigate("/perfil#telegram")}
        style={{
          flexShrink: 0,
          background: "#FFB454",
          border: "none",
          borderRadius: 8,
          padding: "6px 12px",
          color: "#0A1618",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Vincular
      </button>
    </div>
  )
}
