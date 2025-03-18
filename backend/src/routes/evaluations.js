import express from "express";
import evaluationsController from "../controllers/evaluationsController.js";

const router = express.Router();

router
  .route("/")
  .get(evaluationsController.getEvaluations)
  .post(evaluationsController.insertEvaluations);

router
  .route("/:id")
  .put(evaluationsController.updateEvaluations)
  .delete(evaluationsController.deleteEvaluations);

export default router;
