import telegramController from "../controllers/telegram.controller.js"
import express from "express"
const router = express.Router()

router.post("/webhook", telegramController.connectTelegram);

export default router