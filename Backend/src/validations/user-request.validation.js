import Joi from "joi";
import { objectId } from "./custom.validation.js";

// validation for req.body for sending request to join project
const sendRequestToJoinProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    receiver: Joi.string().custom(objectId).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};

// validation for req.body for handling request to join project
const handleRequestToJoinProject = {
  body: Joi.object().keys({
    requestId: Joi.string().custom(objectId).required(),
    isAccept: Joi.number().valid(0, 1).required(),
  }),
};

export { sendRequestToJoinProject, handleRequestToJoinProject };
