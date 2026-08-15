import express from "express"
import diagnosticController from "../controllers/diagnostics.controller.js"
const router = express.Router()

router.get('/', diagnosticController.getDiagnostics)
router.get('/:id', diagnosticController.getDiagnostic)
router.post('/create', diagnosticController.createDiagnostic)

export default router