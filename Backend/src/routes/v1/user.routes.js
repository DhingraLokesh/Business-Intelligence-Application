import express from "express";
import * as userController from "../../controllers/user.controller.js";

const router = express.Router();

router.route("/get-all").get(userController.getAllUsers);

router.route("/get/:userId").get(userController.getAnyUserById);

router.route("/get-by-email").get(userController.getUserByEmail);

router.route("/get").get(userController.getUserById);

router.route("/update").patch(userController.updateUserById);

router.route("/delete").delete(userController.deleteUserById);

router.route("/get-all-projects").get(userController.getUsersProject);

export default router;
