import express from "express";

const router = express.Router();

router.route("/requestCode").post(passwordRecoveryController.requestCode);
router.route("/verifyCode").post(passwordRecoveryController.verifyCode);
router.route("/newPassword").post(passwordRecoveryController.newPassword);