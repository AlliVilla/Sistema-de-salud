import User from "../models/users.js"
import telegramService  from "../services/telegram.service.js"

const connectTelegram = async (req, res) => {
    try {
        console.log("TELEGRAM UPDATE:");
        console.log(JSON.stringify(req.body, null, 2));

        const update = req.body;
        if (!update) return res.sendStatus(200);

        const message = update.message;
        if (!message) return res.sendStatus(200);

        const chatId = message.chat.id;
        const text = message.text || "";

        console.log("Telegram message:", text);
        console.log("Chat ID:", chatId);

        if (text.startsWith("/start")) {
            const parts = text.split(" ");
            const token = parts[1];

            if (!token) {
                await telegramService.sendMessage(
                    chatId,
                    "Hola \n\nPara conectar tu cuenta de MindLink, utiliza el enlace generado desde la aplicación."
                );
                return res.sendStatus(200);
            }

            const user = await User.findOne({ telegramLinkToken: token });

            if (!user) {
                await telegramService.sendMessage(chatId, "El enlace de conexión no es válido o ha expirado.");
                return res.sendStatus(200);
            }

            user.telegramChatId = chatId.toString();
            user.telegramLinkToken = null;
            await user.save();

            await telegramService.sendMessage(
                chatId,
                `¡Hola ${user.nombre_completo}! \n\n` +
                `Tu cuenta de MindLink ha sido conectada correctamente.\n\n` +
                `Ahora recibirás notificaciones cuando se genere un nuevo diagnóstico.`
            );
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error("TELEGRAM WEBHOOK ERROR:", error);
        return res.sendStatus(500);
    }
};

export default { connectTelegram }