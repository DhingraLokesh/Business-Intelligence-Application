import express from "express";
import * as projectController from "../../controllers/project.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as projectValidate from "../../validations/project.validation.js";

const router = express.Router();

// create project
router
  .route("/create")
  .post(
    auth("createProject"),
    validate(projectValidate.createProject),
    projectController.createProject
  );

// get all projects in DB
router.route("/get-all").get(auth("findAllProjects"), projectController.findAllProjects);

// get single project with id
router
  .route("/get/:projectId")
  .get(
    auth("findProjectById"),
    validate(projectValidate.findProjectById),
    projectController.findProjectById
  );

// add single user to project with role
router
  .route("/add-user")
  .post(
    auth("addUserToProject"),
    validate(projectValidate.addUserToProject),
    projectController.addUserToProject
  );

// remove single user from project with role
router
  .route("/remove-user")
  .delete(
    auth("removeUserFromProject"),
    validate(projectValidate.removeUserFromProject),
    projectController.removeUserFromProject
  );
// update single user role in project 
router
  .route("/update-user-role")
  .patch(
    auth("updateUserRoleInProject"),
    validate(projectValidate.updateUserRoleInProject),
    projectController.updateUserRoleInProject
  );

// get all users of project by role
router
  .route("/get-users-by-role")
  .get(
    auth("getUsersOfProjectByRole"),
    validate(projectValidate.getUsersOfProjectByRole),
    projectController.getUsersOfProjectByRole
  );

// get all users of project
router
  .route("/get-users/:projectId")
  .get(
    auth("getUsersOfProject"),
    validate(projectValidate.getUsersOfProject),
    projectController.getUsersOfProject
  );

export default router;
