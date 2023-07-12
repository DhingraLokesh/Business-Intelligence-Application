import express from "express";
import * as commentController from "../../controllers/comments.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// add comment to a project
router
  .route("/add")
  .post(auth("addCommentsOfProject"), commentController.addCommentsOfProject);

// get comments of a project
router
  .route("/get/:projectId")
  .get(auth("getCommentsOfProject"), commentController.getCommentsOfProject);

export default router;
