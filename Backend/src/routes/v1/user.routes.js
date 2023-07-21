import express from "express";
import * as userController from "../../controllers/user.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as userValidate from "../../validations/user.validation.js";

const router = express.Router();

// route to get all users
router.route("/get-all").get(auth("getAllUsers"), userController.getAllUsers);

// route to get any user by id by req.loggedInUserId
router
  .route("/get/:userId")
  .get(
    auth("getAnyUserById"),
    validate(userValidate.getAnyUserById),
    userController.getAnyUserById
  );

// route to upload an image
router.route("/upload").post(auth(), userController.uploadImageController);

// route to get image corresponding to req.loggedInUserId
router
  .route("/getImage")
  .get(auth("getImageController"), userController.getImageController);

// route to get user by email
router
  .route("/get-by-email")
  .get(
    auth("getUserByEmail"),
    validate(userValidate.getUserByEmail),
    userController.getUserByEmail
  );

// route to get any user by id by req.params.userId
router.route("/get").get(auth("getUserById"), userController.getUserById);

// route to update user
router
  .route("/update")
  .patch(
    auth("updateUserById"),
    validate(userValidate.updateUser),
    userController.updateUserById
  );

// route to delete user
router
  .route("/delete")
  .delete(auth("deleteUserById"), userController.deleteUserById);

// route to get all projects of user
router
  .route("/get-all-projects")
  .get(auth("getUsersProject"), userController.getUsersProject);

export default router;
