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