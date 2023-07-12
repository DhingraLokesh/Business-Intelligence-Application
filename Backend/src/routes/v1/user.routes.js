import express from "express";
import * as userController from "../../controllers/user.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as userValidate from "../../validations/user.validation.js";

const router = express.Router();

router.route("/get-all").get(auth("getAllUsers"), userController.getAllUsers);

router
  .route("/get/:userId")
  .get(
    auth("getAnyUserById"),
    validate(userValidate.getAnyUserById),
    userController.getAnyUserById
  );

router
  .route("/get-by-email")
  .get(
    auth("getUserByEmail"),
    validate(userValidate.getUserByEmail),
    userController.getUserByEmail
  );

router.route("/get").get(auth("getUserById"), userController.getUserById);

router
  .route("/update")
  .patch(
    auth("updateUserById"),
    validate(userValidate.updateUser),
    userController.updateUserById
  );

router
  .route("/delete")
  .delete(auth("deleteUserById"), userController.deleteUserById);

// get all projects of user
router
  .route("/get-all-projects")
  .get(auth("getUsersProject"), userController.getUsersProject);

export default router;
