import express from "express";
import * as commentController from "../../controllers/comments.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as commentValidate from "../../validations/comment.validations.js";

const router = express.Router();

// route to add comment to a project
router
  .route("/add")
  .post(
    auth("addCommentsOfProject"),
    validate(commentValidate.addCommentsOfProject),
    commentController.addCommentsOfProject
  );

// route to get comments of a project
router
  .route("/get/:projectId")
  .get(
    auth("getCommentsOfProject"),
    validate(commentValidate.getCommentsOfProject),
    commentController.getCommentsOfProject
  );

export default router;
