import usersController from "../controllers/users.controller.js";
import express from "express";
const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/validate', usersController.validateUser);
router.post('/create', usersController.createUser);
router.patch('/create', usersController.editUser);

export default router;