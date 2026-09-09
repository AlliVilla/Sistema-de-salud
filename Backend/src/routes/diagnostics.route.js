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


/**
 * @swagger
 * /diagnostic/generate/{report_id}:
 *   post:
 *     summary: Generar un diagnóstico con IA
 *     description: >
 *       Envía los signos vitales del reporte al modelo de IA y guarda el diagnóstico
 *       únicamente si detecta una anomalía. Si el reporte ya tiene un diagnóstico, lo
 *       devuelve sin volver a consultar al modelo. La inferencia puede tardar varios
 *       minutos, por lo que conviene usar un timeout amplio en el cliente.
 *     tags: [Diagnostics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         description: ID del reporte cuyos signos vitales se van a analizar.
 *         schema:
 *           type: string
 *           example: 64f987654321abcdef654321
 *     responses:
 *       201:
 *         description: Anomalía detectada. El diagnóstico se generó y se guardó.
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
 *                     description:
 *                       type: string
 *                       example: El paciente presenta taquicardia (132 lpm) e hipoxemia (89%).
 *       200:
 *         description: >
 *           No se creó nada nuevo. Ocurre en dos casos: el reporte ya tenía un
 *           diagnóstico, o el modelo no detectó ninguna anomalía. En el segundo caso
 *           'diagnostic' es null y no se guarda nada en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 diagnostic:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     report_id:
 *                       type: string
 *                     description:
 *                       type: string
 *             examples:
 *               yaExistia:
 *                 summary: El reporte ya tenía diagnóstico
 *                 value:
 *                   message: Diagnostic already exists
 *                   diagnostic:
 *                     id: 64f123456789abcdef123456
 *                     report_id: 64f987654321abcdef654321
 *                     description: El paciente presenta taquicardia (132 lpm) e hipoxemia (89%).
 *               sinAnomalia:
 *                 summary: El modelo no detectó anomalía
 *                 value:
 *                   message: No anomaly detected
 *                   diagnostic: null
 *       400:
 *         description: El report_id no es un ObjectId válido.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Reporte no encontrado.
 *       500:
 *         description: Error interno del servidor.
 *       503:
 *         description: El servicio de IA no está disponible.
 *       504:
 *         description: El servicio de IA no respondió dentro del tiempo límite.
 */

import express from "express"
import diagnosticController from "../controllers/diagnostics.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requireClient } from "../middlewares/role.middleware.js"
const router = express.Router()

router.use(authMiddleware, requireClient)

router.get('/', diagnosticController.getDiagnostics)
router.get('/:id', diagnosticController.getDiagnostic)
router.post('/create', diagnosticController.createDiagnostic)
router.post('/generate/:report_id', diagnosticController.generate)
router.get('/verificar/:id', diagnosticController.verificarIntegridad);

export default router