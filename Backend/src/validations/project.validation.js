import Joi from "joi";
import { objectId } from "./custom.validation.js";

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().min(3).max(100).required(),
  }),
};

const findProjectById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const addUserToProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};

const updateUserRoleInProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};
const removeUserFromProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
  }),
};
const getUsersOfProjectByRole = {
  query: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};

const getUsersOfProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

export {
  createProject,
  findProjectById,
  addUserToProject,
  getUsersOfProjectByRole,
  getUsersOfProject,
  updateUserRoleInProject,
  removeUserFromProject
};
