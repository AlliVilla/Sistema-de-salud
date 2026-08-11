import usersController from "../controllers/users.controller.js";
import express from "express";
const router = express.Router();

router.get('/validate', usersController.validateUser);
router.post('/create', usersController.create);

export default router;