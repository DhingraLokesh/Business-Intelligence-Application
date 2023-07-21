import express from "express";
import * as projectController from "../../controllers/project.controller.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as projectValidate from "../../validations/project.validation.js";

const router = express.Router();

// route to create project
router.route("/create").post(auth(), projectController.createProject);

// route to upload csv file
router
  .route("/upload/:projectId")
  .post(auth(), projectController.uploadFileController);

// route to get csv file
router
  .route("/get-excel/:projectId")
  .get(auth(), projectController.getExcelController);

// route to update project
router
  .route("/update")
  .patch(
    auth(),
    validate(projectValidate.updateProject),
    projectController.updateProject
  );

// route to get all projects in DB
router.route("/get-all").get(auth(), projectController.findAllProjects);

// route to get single project with id
router
  .route("/get/:projectId")
  .get(
    auth(),
    validate(projectValidate.findProjectById),
    projectController.findProjectById
  );

// route to add single user to project with role
router
  .route("/add-user")
  .post(
    auth(),
    validate(projectValidate.addUserToProject),
    projectController.addUserToProject
  );

// route to remove single user from project with role
router
  .route("/remove-user")
  .delete(
    auth(),
    validate(projectValidate.removeUserFromProject),
    projectController.removeUserFromProject
  );
// route to update single user role in project
router
  .route("/update-user-role")
  .patch(
    auth(),
    validate(projectValidate.updateUserRoleInProject),
    projectController.updateUserRoleInProject
  );

// route to get all users of project
router
  .route("/get-users/:projectId")
  .get(
    auth(),
    validate(projectValidate.getUsersOfProject),
    projectController.getUsersOfProject
  );

// route to get project user
router
  .route("/get-user/:projectId")
  .get(
    auth(),
    validate(projectValidate.getProjectUser),
    projectController.getProjectUser
  );

export default router;
