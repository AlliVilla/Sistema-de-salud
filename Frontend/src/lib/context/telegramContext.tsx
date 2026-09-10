// lib/context/telegramContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import { getMe } from "../api/users"
import { getToken } from "../api/client"

interface TelegramContextValue {
  telegramChatId: string | null
  loading: boolean
  refresh: () => Promise<string | null>
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (): Promise<string | null> => {
    if (!getToken()) {
      setTelegramChatId(null)
      setLoading(false)
      return null
    }

    try {
      const user = await getMe()
      const chatId = user.telegramChatId ?? null
      setTelegramChatId(chatId)
      return chatId
    } catch {
      setTelegramChatId(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    void (async () => {
      if (!getToken()) {
        if (active) {
          setTelegramChatId(null)
          setLoading(false)
        }
        return
      }

      try {
        const user = await getMe()
        if (active) setTelegramChatId(user.telegramChatId ?? null)
      } catch {
        if (active) setTelegramChatId(null)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return (
    <TelegramContext.Provider value={{ telegramChatId, loading, refresh }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const ctx = useContext(TelegramContext)
  if (!ctx)
    throw new Error("useTelegram debe usarse dentro de TelegramProvider")
  return ctx
}
