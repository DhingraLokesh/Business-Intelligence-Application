import Joi from "joi";
import { objectId } from "./custom.validation.js";

// validation for req.body for adding comment
const addCommentsOfProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    message: Joi.string().min(1).max(200).required(),
  }),
};

// validation for req.params for getting comments
const getCommentsOfProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

export { addCommentsOfProject, getCommentsOfProject };
