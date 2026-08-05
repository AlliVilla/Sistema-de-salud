# Portable Health Monitoring App

Interfaz visual (frontend) de un sistema de monitoreo de salud portátil con wearable. **Por ahora es solo UI** con datos de ejemplo; en el futuro se conectará a un backend de **FastAPI** que usará **Ollama** como LLM para análisis y notas clínicas.

---

## Estado actual

- Frontend: **React 19 + Vite 8 + TypeScript + Tailwind CSS v4**
- Mockups de 6 pantallas en un layout **responsive** de aplicación web (header + contenido + navegación adaptativa)
- Navegación por estado en `App.tsx` y componentes de layout en `components/layout/`
- Datos estáticos en `src/lib/mock.ts`
- Capa de API preparada pero **sin backend todavía** (las páginas usan `mock.ts`, no la API)

### Pantallas

| Pantalla | Archivo | Descripción |
| --- | --- | --- |
| Vincular dispositivo | `src/pages/onboarding/VincularDispositivo.tsx` | Simula escaneo BT y conexión del wearable |
| Registro paciente | `src/pages/onboarding/RegistroPaciente.tsx` | Formulario de perfil médico |
| Dashboard | `src/pages/Dashboard.tsx` | Signos vitales en vivo (FC, SpO₂, temperatura) |
| Alertas | `src/pages/Alertas.tsx` | Alerta activa con "Nota de IA" + alertas resueltas |
| Historial blockchain | `src/pages/Blockchain.tsx` | Ledger de eventos con hashes |
| Perfil | `src/pages/Perfil.tsx` | Datos del paciente, dispositivo y ajustes |

---

## Estructura del frontend

```
Portable Health Monitoring App/
├── index.html                    # Shell HTML de Vite (#root)
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # TypeScript + alias "@/*" → src/*
├── vite.config.ts                # Config Vite (React, Tailwind v4, alias @)
├── .mise.toml                    # Versiones de Node/pnpm
├── AGENTS.md                     # Guía de convenciones del proyecto
└── src/
    ├── main.tsx                  # Entrypoint: monta <App />
    ├── index.css                 # Tailwind v4 + tema CSS + animaciones
    ├── App.tsx                   # Orquestador de pantallas (flujo + estado)
    ├── types.ts                  # Tipos de dominio (ScreenId, Alert, etc.)
    ├── theme.ts                  # Design tokens (colores, radios)
    │
    ├── constants/
    │   └── navigation.ts         # NAV_ITEMS y datos mock del paciente (PATIENT)
    │
    ├── lib/
    │   ├── mock.ts               # Datos de ejemplo (reemplazables por la API)
    │   └── api/
    │       ├── client.ts         # Helper fetch() → FastAPI (VITE_API_URL)
    │       ├── endpoints.ts      # Ruta canónica de endpoints del backend
    │       └── ollama.ts         # chatWithOllama() → proxy Ollama del backend
    │
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx      # Shell responsive (header, contenido, footer nav)
    │   │   └── NavBar.tsx         # Navegación adaptativa (top en escritorio, inferior en móvil)
    │   └── charts/
    │       ├── EcgLine.tsx        # Línea ECG animada (acento superior)
    │       └── TempTrendChart.tsx # Sparkline de temperatura
    │
    └── pages/
        ├── onboarding/
        │   ├── VincularDispositivo.tsx
        │   └── RegistroPaciente.tsx
        ├── Dashboard.tsx
        ├── Alertas.tsx
        ├── Blockchain.tsx
        └── Perfil.tsx
```

---

## Cómo correrlo

```bash
cd "Portable Health Monitoring App"
pnpm install        # primera vez
pnpm dev            # servidor de desarrollo (puerto por defecto 8443)
pnpm build          # build de producción
pnpm format         # formateo con oxfmt
```

---

## Arquitectura y conexión futura con el backend

```
[ Wearable (Bluetooth) ]
        │
        ▼
┌────────────────────────┐      HTTP / JSON      ┌───────────────────────────┐
│  Frontend React (Vite) │  ───────────────────▶ │  Backend FastAPI          │
│  src/pages/*           │  ◀─────────────────── │  /api/vitals, /api/alerts │
└────────────────────────┘    respuestas        │  /api/blockchain           │
                                               └────────────┬──────────────┘
                                                            │ LLM local
                                                            ▼
                                                  ┌───────────────────────┐
                                                  │  Ollama (llama3.2)    │
                                                  └───────────────────────┘
```

### Qué hay preparado en el frontend

1. **`lib/api/client.ts`** — helper `api<T>(path, options)` con base en `VITE_API_URL` (default `http://localhost:8000`). Es el único punto de entrada HTTP; si se pasa a axios/ky, se cambia solo este archivo.
2. **`lib/api/endpoints.ts`** — mapa canónico de rutas del backend (`/health`, `/api/vitals/latest`, `/api/alerts`, `/api/blockchain/entries`, `/api/ollama/chat`, …).
3. **`lib/api/ollama.ts`** — `chatWithOllama(messages, model)` que llamará al endpoint del backend, y éste a Ollama local. El modelo por defecto es `llama3.2`.
4. **`lib/mock.ts`** — los datos de ejemplo. Para conectar, reemplazar el import de `mock.ts` por una llamada `api(...)` en cada página (p. ej. Dashboard → `api<VitalsReading>(ENDPOINTS.vitals)`).

### Cómo conectar paso a paso (cuando exista el backend)

1. Levantar FastAPI con CORS habilitado (permitir `http://localhost:8443`).
2. Instalar y servir Ollama localmente (`ollama serve`, `ollama pull llama3.2`).
3. En el frontend, crear `.env.local` con `VITE_API_URL=http://localhost:8000`.
4. En `Dashboard.tsx`, `Alertas.tsx`, `Blockchain.tsx` y `Perfil.tsx`, sustituir los imports de `lib/mock` por los hooks/llamadas a `lib/api`. Los tipos ya están definidos en `src/types.ts`.

---

## Convenciones del código

- **Componentes**: exports por defecto, una responsabilidad por archivo, archivo en la carpeta que corresponde (layout/charts/ui/pages).
- **Estilos**: Tailwind v4 para clases globales; estilos inline para componentes vía `theme.ts` (tokens centralizados).
- **Textos**: en español, sin emojis, comillas dobles en strings que contienen apóstrofes.
- **Navegación**: `ScreenId` (union type en `src/types.ts`) para tipar las pantallas; `NAV_ITEMS` en `constants/navigation.ts` para la barra inferior.
