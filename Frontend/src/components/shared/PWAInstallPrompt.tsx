import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada / modo standalone
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    setIsStandalone(isRunningStandalone)

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    // Escuchar evento de instalación estándar (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  // No mostrar si ya está instalada o el usuario lo cerró
  if (isStandalone || dismissed) return null

  // En Android / Chrome con evento de instalación
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 z-50 flex items-center justify-between gap-3 bg-[var(--surface-card,#101F22)] border border-[var(--accent-teal,#2DD4BF)]/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in max-w-sm">
        <div className="flex items-center gap-3">
          <img src="/pwa-192x192.png" alt="App Icon" className="w-10 h-10 rounded-xl shadow" />
          <div className="text-left">
            <p className="text-xs font-semibold text-[var(--text,#EAF2F1)] leading-tight">Instalar Sistema de Salud</p>
            <p className="text-[11px] text-[var(--muted,#7FA09C)] leading-tight mt-0.5">Accede rápido desde tu pantalla</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-[var(--accent-teal,#2DD4BF)] hover:bg-[#26bba8] text-[#060E10] font-semibold text-xs rounded-xl transition shadow"
          >
            Instalar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-[var(--muted,#7FA09C)] hover:text-white rounded-lg text-xs"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // En iOS Safari (guía de instalación)
  if (isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-[var(--surface-card,#101F22)] border border-[var(--border,#283E42)] p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm mx-auto animate-fade-in text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img src="/pwa-192x192.png" alt="App Icon" className="w-9 h-9 rounded-xl shadow" />
            <div>
              <p className="text-xs font-semibold text-[var(--text,#EAF2F1)]">Instalar en iPhone / iPad</p>
              <p className="text-[11px] text-[var(--muted,#7FA09C)] mt-0.5">
                Toca <span className="text-[var(--accent-teal,#2DD4BF)] font-semibold">Compartir ⎋</span> y luego <span className="text-[var(--accent-teal,#2DD4BF)] font-semibold">"Agregar a inicio ➕"</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-[var(--muted,#7FA09C)] hover:text-white text-xs p-1"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return null
}
