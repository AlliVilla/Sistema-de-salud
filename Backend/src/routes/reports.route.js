/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Gestión de reportes de signos vitales de los usuarios
 */

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Obtener todos los reportes
 *     description: Obtiene todos los reportes pertenecientes al usuario autenticado. Los reportes de otros usuarios no son accesibles.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reportes obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f123456789abcdef123456
 *                       user_id:
 *                         type: string
 *                         example: 64f987654321abcdef654321
 *                       heart_rate:
 *                         type: number
 *                         description: Ritmo cardíaco del usuario.
 *                         example: 75
 *                       temperature:
 *                         type: number
 *                         description: Temperatura corporal del usuario.
 *                         example: 36.5
 *                       oxygenation:
 *                         type: number
 *                         description: Nivel de oxigenación en sangre.
 *                         example: 98
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-08-17T15:30:00.000Z
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: No se encontraron reportes.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Obtener un reporte
 *     description: Obtiene un reporte específico perteneciente al usuario autenticado.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte que se desea consultar.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Reporte obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 findReport:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f123456789abcdef123456
 *                     user_id:
 *                       type: string
 *                       example: 64f987654321abcdef654321
 *                     heart_rate:
 *                       type: number
 *                       description: Ritmo cardíaco del usuario.
 *                       example: 75
 *                     temperature:
 *                       type: number
 *                       description: Temperatura corporal del usuario.
 *                       example: 36.5
 *                     oxygenation:
 *                       type: number
 *                       description: Nivel de oxigenación en sangre.
 *                       example: 98
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-08-17T15:30:00.000Z
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Reporte no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /report/create:
 *   post:
 *     summary: Crear un reporte
 *     description: Crea un nuevo reporte de signos vitales asociado automáticamente al usuario autenticado.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - heart_rate
 *               - temperature
 *               - oxygenation
 *             properties:
 *               heart_rate:
 *                 type: number
 *                 description: Ritmo cardíaco del usuario.
 *                 example: 75
 *               temperature:
 *                 type: number
 *                 description: Temperatura corporal del usuario.
 *                 example: 36.5
 *               oxygenation:
 *                 type: number
 *                 description: Nivel de oxigenación en sangre.
 *                 example: 98
 *     responses:
 *       201:
 *         description: Reporte creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Report created succesfully
 *                 report:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f123456789abcdef123456
 *                     user_id:
 *                       type: string
 *                       example: 64f987654321abcdef654321
 *                     heart_rate:
 *                       type: number
 *                       example: 75
 *                     temperature:
 *                       type: number
 *                       example: 36.5
 *                     oxygenation:
 *                       type: number
 *                       example: 98
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-08-17T15:30:00.000Z
 *       400:
 *         description: Faltan campos obligatorios.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error interno del servidor.
 */


import express from "express"
import reportsController from "../controllers/reports.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requireClient } from "../middlewares/role.middleware.js"
const router = express.Router()

router.use(authMiddleware, requireClient)

router.get('/', reportsController.getReports)
router.get('/:id', reportsController.getReport)
router.post('/create', reportsController.createReport)

export default router