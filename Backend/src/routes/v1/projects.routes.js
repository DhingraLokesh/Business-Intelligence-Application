import express from "express";
import * as projectController from "../../controllers/project.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// create project
router
  .route("/create")
  .post(auth("createProject"), projectController.createProject);

// get all projects in DB
router
  .route("/get-all")
  .get(auth("findAllProjects"), projectController.findAllProjects);

// get single project with id
router
  .route("/get/:projectId")
  .get(auth("findProjectById"), projectController.findProjectById);

// add single user to project with role
router
  .route("/add-user")
  .post(auth("addUserToProject"), projectController.addUserToProject);

// remove single user from project with role
router
  .route("/remove-user")
  .delete(
    auth("removeUserFromProject"),
    projectController.removeUserFromProject
  );
// update single user role in project
router
  .route("/update-user-role")
  .patch(
    auth("updateUserRoleInProject"),
    projectController.updateUserRoleInProject
  );

// get all users of project by role
router
  .route("/get-users-by-role")
  .get(
    auth("getUsersOfProjectByRole"),
    projectController.getUsersOfProjectByRole
  );

// get all users of project
router
  .route("/get-users/:projectId")
  .get(auth("getUsersOfProject"), projectController.getUsersOfProject);

export default router;
