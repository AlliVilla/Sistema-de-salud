import express from "express"
import diagnosticController from "../controllers/diagnostics.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
const router = express.Router()

router.use(authMiddleware)

router.get('/', diagnosticController.getDiagnostics)
router.get('/:id', diagnosticController.getDiagnostic)
router.post('/create', diagnosticController.createDiagnostic)

export default router