import Joi from "joi";
import { objectId } from "./custom.validation.js";

const addCommentsOfProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    message: Joi.string().min(1).max(200).required(),
  }),
};

const getCommentsOfProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

export { addCommentsOfProject, getCommentsOfProject };
