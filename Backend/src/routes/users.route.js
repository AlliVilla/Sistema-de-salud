/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene la lista de todos los usuarios registrados.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Usuario no autorizado.
 *       404:
 *         description: No se encontraron usuarios.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /user/confirm-email/{token}:
 *   get:
 *     summary: Confirmar correo electrónico
 *     description: Confirma el correo electrónico de un usuario mediante el token enviado por correo.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmación del correo electrónico.
 *         schema:
 *           type: string
 *           example: 8f4a7c2e9b1d6a3c
 *     responses:
 *       200:
 *         description: Email validado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email validado con exito
 *                 result:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: El token de verificación es requerido.
 *       404:
 *         description: La verificación falló. El token puede ser inválido o haber expirado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /user/validate:
 *   post:
 *     summary: Validar usuario
 *     description: Verifica las credenciales del usuario y genera un token JWT.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Usuario validado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario validado correctamente
 *                 email:
 *                   type: string
 *                   example: usuario@gmail.com
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 result:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Faltan campos obligatorios.
 *       401:
 *         description: Correo o contraseña incorrectos.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario y envía un correo electrónico con un token para confirmar su cuenta.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *               - emergency_phone
 *               - address
 *               - age
 *               - condition
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *                 example: Password123
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario.
 *                 example: Juan Pérez
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del usuario.
 *                 example: "99999999"
 *               emergency_phone:
 *                 type: string
 *                 description: Número de teléfono de emergencia.
 *                 example: "88888888"
 *               address:
 *                 type: string
 *                 description: Dirección del usuario.
 *                 example: San Pedro Sula, Cortés
 *               age:
 *                 type: integer
 *                 description: Edad del usuario.
 *                 example: 25
 *               condition:
 *                 type: string
 *                 description: Condición médica del usuario.
 *                 example: Hipertensión
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado correctamente
 *                 user:
 *                   type: object
 *       400:
 *         description: Faltan campos obligatorios o no se pudo crear el usuario.
 *       409:
 *         description: El correo electrónico ya está en uso.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /user/update/{id}:
 *   patch:
 *     summary: Actualizar usuario
 *     description: Actualiza la información de un usuario autenticado. El usuario solamente puede modificar su propio perfil.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea actualizar.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Juan Pérez
 *               phone:
 *                 type: string
 *                 description: Número de teléfono.
 *                 example: "99999999"
 *               emergency_phone:
 *                 type: string
 *                 description: Número de teléfono de emergencia.
 *                 example: "88888888"
 *               address:
 *                 type: string
 *                 description: Dirección del usuario.
 *                 example: San Pedro Sula, Cortés
 *               status:
 *                 type: boolean
 *                 description: Estado activo o inactivo del usuario.
 *                 example: true
 *               age:
 *                 type: integer
 *                 description: Edad del usuario.
 *                 example: 25
 *               condition:
 *                 type: string
 *                 description: Condición médica del usuario.
 *                 example: Hipertensión
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: ID requerido o no hay campos para actualizar.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permiso para modificar este perfil.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */


import usersController from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import express from "express";
const router = express.Router();

router.get('/', authMiddleware, usersController.getUsers);
router.get('/confirm-email/:token', usersController.confirmEmail);
router.post('/validate', usersController.validateUser);
router.post('/create', usersController.createUser);
router.patch('/update/:id', authMiddleware, usersController.editUser);

export default router;