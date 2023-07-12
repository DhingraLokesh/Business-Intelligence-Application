import express from "express";
import * as authController from "../../controllers/auth.controller.js";
import validate from "../../middlewares/validate.js";
import * as authValidate from "../../validations/auth.validation.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(authValidate.register), authController.register);

router.route("/login").post(validate(authValidate.login), authController.login);

export default router;
