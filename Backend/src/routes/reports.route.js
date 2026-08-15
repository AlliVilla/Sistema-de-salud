import express from "express"
import reportsController from "../controllers/reports.controller.js"
const router = express.Router()

router.get('/', reportsController.getReports)
router.get('/:id', reportsController.getReport)
router.post('/create', reportsController.createReport)

export default router