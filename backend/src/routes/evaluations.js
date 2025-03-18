import express from "express";
import evaluationsController from "../controllers/evaluationsController.js";

const router = express.Router();

router
  .route("/")
  .get(evaluationsController.getReviews)
  .post(evaluationssController.insertReview);

router
  .route("/:id")
  .put(evaluationsController.updateReview)
  .delete(evaluationsController.deleteReview);

export default router;
