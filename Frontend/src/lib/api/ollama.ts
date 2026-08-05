import { api } from './client'
import { ENDPOINTS } from './endpoints'

// Chat bridge to the FastAPI backend, which in turn proxies to a local
// Ollama instance. `model` should match a tag pulled in Ollama
// (`ollama pull llama3.2`).
export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OllamaChatResponse {
  model: string
  message: OllamaMessage
  done?: boolean
}

export async function chatWithOllama(
  messages: OllamaMessage[],
  model = 'llama3.2',
): Promise<OllamaChatResponse> {
  return api<OllamaChatResponse>(ENDPOINTS.ollamaChat, {
    method: 'POST',
    body: JSON.stringify({ model, messages, stream: false }),
  })
}