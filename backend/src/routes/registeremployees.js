import express from "express";
import registeremployeesController from "../controllers/registeremployeesController.js";

const router = express.Router();

router.route("/").post(registeremployeesController.register);

export default router;