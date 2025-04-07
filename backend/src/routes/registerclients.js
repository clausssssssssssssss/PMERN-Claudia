import express from "express"
import registerClientsController from "../controllers/registerclientsController";

const router = express.Router();

router.route("/").post();
router.route("/verifyCodeEmail").post();
 
export default router;