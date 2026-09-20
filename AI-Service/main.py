import json
import os
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mi-modelo")
OLLAMA_TIMEOUT = float(os.getenv("OLLAMA_TIMEOUT", "300"))
OLLAMA_KEEP_ALIVE = os.getenv("OLLAMA_KEEP_ALIVE", "30m")
OLLAMA_SYSTEM_PROMPT = os.getenv("OLLAMA_SYSTEM_PROMPT")

# structured output
RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "anomaly": {"type": "boolean"},
        "description": {"type": "string"},
    },
    "required": ["anomaly", "description"],
}

client: httpx.AsyncClient | None = None


class VitalSigns(BaseModel):
    heart_rate: float = Field(..., description="Ritmo cardiaco en lpm")
    temperature: float = Field(..., description="Temperatura corporal en grados centigrados")
    oxygenation: float = Field(..., description="Saturacion de oxigeno en porcentaje")


class Analysis(BaseModel):
    anomaly: bool
    description: str
    model: str


def fmt(value: float) -> str:
    return str(int(value)) if value == int(value) else str(value)


def build_prompt(vitals: VitalSigns) -> str:
    return "\n".join([
        "Signos vitales registrados por el wearable del paciente:",
        f"- Ritmo cardiaco: {fmt(vitals.heart_rate)} lpm",
        f"- Temperatura: {fmt(vitals.temperature)} °C",
        f"- Oxigenacion: {fmt(vitals.oxygenation)} %",
        "",
        "Evalua si estos signos vitales presentan alguna anomalia y responde en JSON:",
        "- 'anomaly': true si detectas una anomalia que amerite notificar, false si todo esta dentro de lo normal.",
        "- 'description': si 'anomaly' es true, describe la anomalia y la accion recomendada. Si es false, deja el texto vacio.",
    ])


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    client = httpx.AsyncClient(base_url=OLLAMA_URL, timeout=OLLAMA_TIMEOUT)
    yield
    await client.aclose()


app = FastAPI(title="Servicio de diagnostico", version="1.0.0", lifespan=lifespan)


@app.get("/health")
async def health():
    try:
        response = await client.get("/api/tags", timeout=5)
        models = [m["name"] for m in response.json().get("models", [])]
    except httpx.RequestError as error:
        raise HTTPException(status_code=503, detail=f"No se pudo contactar a Ollama: {error}")

    return {
        "status": "ok",
        "ollama_url": OLLAMA_URL,
        "model": OLLAMA_MODEL,
        "model_available": OLLAMA_MODEL in models or f"{OLLAMA_MODEL}:latest" in models,
    }


@app.post("/analyze", response_model=Analysis)
async def analyze(vitals: VitalSigns):
    messages = []
    if OLLAMA_SYSTEM_PROMPT:
        messages.append({"role": "system", "content": OLLAMA_SYSTEM_PROMPT})
    messages.append({"role": "user", "content": build_prompt(vitals)})

    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "format": RESPONSE_SCHEMA,
        "keep_alive": OLLAMA_KEEP_ALIVE,
    }

    try:
        response = await client.post("/api/chat", json=payload)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail=f"Ollama no respondio en {OLLAMA_TIMEOUT}s")
    except httpx.RequestError as error:
        raise HTTPException(status_code=503, detail=f"No se pudo contactar a Ollama: {error}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Ollama respondio {response.status_code}: {response.text}")

    content = response.json().get("message", {}).get("content", "").strip()
    if not content:
        raise HTTPException(status_code=502, detail="Ollama devolvio una respuesta vacia")

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail=f"Ollama no devolvio JSON: {content}")

    if not isinstance(parsed.get("anomaly"), bool):
        raise HTTPException(status_code=502, detail=f"Falta el campo 'anomaly' en la respuesta: {content}")

    description = str(parsed.get("description") or "").strip()
    if parsed["anomaly"] and not description:
        description = (
            f"Anomalia detectada en los signos vitales: {fmt(vitals.heart_rate)} lpm, "
            f"{fmt(vitals.temperature)} °C, {fmt(vitals.oxygenation)} %."
        )

    return Analysis(anomaly=parsed["anomaly"], description=description, model=OLLAMA_MODEL)
