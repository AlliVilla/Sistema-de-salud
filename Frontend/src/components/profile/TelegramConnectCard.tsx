import { useEffect, useState } from "react"
import { theme } from "../../theme"
import { getTelegramLink } from "../../lib/api/users"
import { useTelegram } from "../../lib/context/telegramContext"
import TelegramIcon from "../shared/TelegramIcon"

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 60000

type ConnectStatus = "disconnected" | "opening" | "waiting" | "error"

const badgeByState: Record<"connected" | ConnectStatus, {
  label: string
  color: string
  bg: string
  border: string
}> = {
  connected: {
    label: "Conectado",
    color: theme.colors.teal,
    bg: "rgba(45,212,191,0.1)",
    border: "rgba(45,212,191,0.2)",
  },
  disconnected: {
    label: "Sin conectar",
    color: theme.colors.muted,
    bg: "rgba(127,160,156,0.08)",
    border: "rgba(127,160,156,0.2)",
  },
  opening: {
    label: "Abriendo Telegram…",
    color: theme.colors.muted,
    bg: "rgba(127,160,156,0.08)",
    border: "rgba(127,160,156,0.2)",
  },
  waiting: {
    label: "Esperando confirmación…",
    color: theme.colors.amber,
    bg: "rgba(255,180,84,0.1)",
    border: "rgba(255,180,84,0.25)",
  },
  error: {
    label: "Error",
    color: theme.colors.danger,
    bg: "rgba(255,107,107,0.1)",
    border: "rgba(255,107,107,0.25)",
  },
}

export default function TelegramConnectCard() {
  const { telegramChatId, refresh } = useTelegram()
  const [status, setStatus] = useState<ConnectStatus>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)

  const connected = !!telegramChatId
  const busy = status === "opening" || status === "waiting"

  useEffect(() => {
    if (status !== "waiting" || connected) return

    let cancelled = false
    const interval = setInterval(async () => {
      const chatId = await refresh()
      if (!cancelled && chatId) setStatus("disconnected")
    }, POLL_INTERVAL_MS)

    const timeout = setTimeout(() => {
      if (cancelled) return
      clearInterval(interval)
      setStatus("disconnected")
      setError(
        "No detectamos la vinculación. Abre Telegram, pulsa Start y vuelve a intentarlo.",
      )
    }, POLL_TIMEOUT_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [status, connected, refresh])

  const handleConnect = async () => {
    if (busy || connected) return

    setError(null)
    setFallbackUrl(null)
    setStatus("opening")

    // Abre la pestaña de forma síncrona para esquivar el bloqueador de popups.
    const win = window.open("", "_blank")
    if (win) win.opener = null

    try {
      const url = await getTelegramLink()
      if (win) {
        win.location.href = url
      } else {
        setFallbackUrl(url)
      }
      setStatus("waiting")
    } catch (e) {
      if (win) win.close()
      setStatus("error")
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo generar el enlace de Telegram.",
      )
    }
  }

  const badge = badgeByState[connected ? "connected" : status]

  return (
    <div
      id="telegram"
      style={{
        background: theme.colors.surface,
        borderRadius: theme.radius.card,
        border: `1px solid ${theme.colors.border}`,
        padding: "16px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 10,
            background: "rgba(45,212,191,0.1)",
            border: "1px solid rgba(45,212,191,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.colors.teal,
          }}
        >
          <TelegramIcon size={18} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text }}
          >
            Notificaciones por Telegram
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: 4,
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 20,
              color: badge.color,
              background: badge.bg,
              border: `1px solid ${badge.border}`,
            }}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {connected ? (
        <p style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.6 }}>
          Tu cuenta está vinculada. Recibirás aquí los avisos cuando se genere
          un nuevo diagnóstico.
        </p>
      ) : (
        <>
          <p
            style={{
              fontSize: 13,
              color: theme.colors.muted,
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            Vincula tu cuenta de Telegram para recibir alertas de nuevos
            diagnósticos directamente en tu chat.
          </p>

          <button
            onClick={handleConnect}
            disabled={busy}
            style={{
              width: "100%",
              background: busy ? "rgba(45,212,191,0.15)" : theme.colors.teal,
              border: "none",
              borderRadius: theme.radius.button,
              padding: "13px",
              color: busy ? theme.colors.teal : "#0A1618",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: busy ? "default" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            {status === "opening"
              ? "Generando enlace…"
              : status === "waiting"
                ? "Esperando confirmación…"
                : "Conectar Telegram"}
          </button>

          {status === "waiting" && (
            <p
              style={{
                fontSize: 12,
                color: theme.colors.amber,
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              Se abrió Telegram. Pulsa <strong>Start</strong> en el chat del
              bot; esta tarjeta se actualizará sola.
            </p>
          )}

          {error && (
            <p
              style={{
                fontSize: 12,
                color: theme.colors.danger,
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              {error}
            </p>
          )}

          {fallbackUrl && (
            <p
              style={{
                fontSize: 12,
                color: theme.colors.muted,
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              No pudimos abrir la pestaña. Copia este enlace en tu navegador:{" "}
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: theme.colors.teal, wordBreak: "break-all" }}
              >
                {fallbackUrl}
              </a>
            </p>
          )}
        </>
      )}
    </div>
  )
}
