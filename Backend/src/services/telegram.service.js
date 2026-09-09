// telegram.service.js
const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

const sendMessage = async (chatId, text) => {
  const response = await fetch(`${BASE_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })

  const data = await response.json()

  if (!data.ok) {
    console.error('[telegram.service] sendMessage FAILED:', data)
    throw new Error(data.description || 'Telegram sendMessage failed')
  }

  console.log('[telegram.service] sendMessage OK')
  return data
}

export default { sendMessage }