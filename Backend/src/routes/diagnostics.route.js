/**
 * @swagger
 * tags:
 *   name: Diagnostics
 *   description: Gestión de diagnósticos médicos asociados a reportes
 */

/**
 * @swagger
 * /diagnostic:
 *   get:
 *     summary: Obtener todos los diagnósticos
 *     description: Obtiene todos los diagnósticos pertenecientes a los reportes del usuario autenticado.
 *     tags: [Diagnostics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diagnósticos obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diagnostics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f123456789abcdef123456
 *                       report_id:
 *                         type: string
 *                         example: 64f987654321abcdef654321
 *                       hash:
 *                         type: string
 *                         example: a8f5f167f44f4964e6c998dee827110c
 *                       description:
 *                         type: string
 *                         example: El paciente presenta signos vitales normales.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: No se encontraron diagnósticos.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /diagnostic/{id}:
 *   get:
 *     summary: Obtener un diagnóstico
 *     description: Obtiene un diagnóstico específico perteneciente a uno de los reportes del usuario autenticado.
 *     tags: [Diagnostics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del diagnóstico que se desea consultar.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Diagnóstico obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 findDiagnostic:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f123456789abcdef123456
 *                     report_id:
 *                       type: string
 *                       example: 64f987654321abcdef654321
 *                     hash:
 *                       type: string
 *                       example: a8f5f167f44f4964e6c998dee827110c
 *                     description:
 *                       type: string
 *                       example: El paciente presenta signos vitales normales.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Diagnóstico no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /diagnostic/create:
 *   post:
 *     summary: Crear un diagnóstico
 *     description: Crea un diagnóstico asociado a un reporte perteneciente al usuario autenticado.
 *     tags: [Diagnostics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report_id
 *               - hash
 *               - description
 *             properties:
 *               report_id:
 *                 type: string
 *                 description: ID del reporte al que pertenece el diagnóstico.
 *                 example: 64f987654321abcdef654321
 *               hash:
 *                 type: string
 *                 description: Hash asociado al diagnóstico.
 *                 example: a8f5f167f44f4964e6c998dee827110c
 *               description:
 *                 type: string
 *                 description: Descripción del diagnóstico.
 *                 example: El paciente presenta signos vitales normales.
 *     responses:
 *       201:
 *         description: Diagnóstico creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Diagnostic created succesfully
 *                 diagnostic:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f123456789abcdef123456
 *                     report_id:
 *                       type: string
 *                       example: 64f987654321abcdef654321
 *                     hash:
 *                       type: string
 *                       example: a8f5f167f44f4964e6c998dee827110c
 *                     description:
 *                       type: string
 *                       example: El paciente presenta signos vitales normales.
 *       400:
 *         description: Faltan campos obligatorios.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Reporte no encontrado o no pertenece al usuario.
 *       500:
 *         description: Error interno del servidor.
 */


import express from "express"
import diagnosticController from "../controllers/diagnostics.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
const router = express.Router()

router.use(authMiddleware)

router.get('/', diagnosticController.getDiagnostics)
router.get('/:id', diagnosticController.getDiagnostic)
router.post('/create', diagnosticController.createDiagnostic)
router.post('/generate/:report_id', diagnosticController.generate)

export default router