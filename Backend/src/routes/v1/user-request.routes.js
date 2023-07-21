import express from "express";
import * as userRequestController from "../../controllers/user-request.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as userRequestValidate from "../../validations/user-request.validation.js";

const router = express.Router();

// route to send request to join project
router
  .route("/send")
  .post(
    auth("sendRequestToJoinProject"),
    validate(userRequestValidate.sendRequestToJoinProject),
    userRequestController.sendRequestToJoinProject
  );

// route to handle request sent by a user
router
  .route("/handle")
  .post(
    auth("handleRequestToJoinProject"),
    validate(userRequestValidate.handleRequestToJoinProject),
    userRequestController.handleRequestToJoinProject
  );

// route to get all requests sent and received by user
router
  .route("/get-all")
  .get(auth("getAllRequests"), userRequestController.getAllRequests);

export default router;
