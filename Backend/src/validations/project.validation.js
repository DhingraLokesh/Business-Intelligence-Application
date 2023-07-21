import Joi from "joi";
import { objectId } from "./custom.validation.js";

// validation for req.body for creating project
const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().min(3).max(100).required(),
  }),
};

// validation for req.body for updating project
const updateProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    name: Joi.string(),
    description: Joi.string().min(3).max(100),
    chart: Joi.object().keys({
      type: Joi.string().valid("bar", "line", "pie", "column"),
      xField: Joi.string(),
      yField: Joi.string().allow(null, ""),
      title: Joi.string().allow(null, ""),
    }),
  }),
};

// validation for req.params for finding project through id
const findProjectById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

// validation for req.body for adding user to project
const addUserToProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userIds: Joi.array().items(Joi.custom(objectId)).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};

// validation for req.body for updating user role in project
const updateUserRoleInProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid("editor", "commentor", "viewer").required(),
  }),
};

// validation for req.body for removing user  in project
const removeUserFromProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
  }),
};

// validation for req.params for getting all users of project
const getUsersOfProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

// validation for req.params for getting project user
const getProjectUser = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

export {
  createProject,
  updateProject,
  findProjectById,
  addUserToProject,
  getUsersOfProject,
  updateUserRoleInProject,
  removeUserFromProject,
  getProjectUser,
};
