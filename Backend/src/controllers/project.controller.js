import catchAsync from "../utils/general/catch-async.js";
import * as projectServices from "../services/project.services.js";
import { uploadFile } from "../utils/general/multer.js";
import ApiError from "../utils/api-error/index.js";
// controller to create project
const createProject = catchAsync(async (req, res) => {
  const project = await projectServices.createProject(
    req.loggedInUserId,
    req.body
  );

  res.send(project);
});

// controller to upload File
const uploadFileController = catchAsync(async (req, res) => {
  try {
    const file = await uploadFile(req, res, req.params.projectId);
    console.log("file uploaded", file);
    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.log("error uploading file ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});

// controller to get File
const getExcelController = catchAsync(async (req, res) => {
  try {
    const excel = await projectServices.getExcel(req.params.projectId);
    res.send(excel);
  } catch (error) {
    console.log("error getting excel ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});

// controller to update project
const updateProject = catchAsync(async (req, res) => {
  const project = await projectServices.updateProject(req.body);
  res.send(project);
});

// controller to get all projects in DB
const findAllProjects = catchAsync(async (req, res) => {
  const projects = await projectServices.findAllProjects();
  res.send(projects);
});

// controller to get single project with id
const findProjectById = catchAsync(async (req, res) => {
  const project = await projectServices.findProjectById(req.params.projectId);
  res.send(project);
});

// controller to add single user to project with role
const addUserToProject = catchAsync(async (req, res) => {
  const user = await projectServices.addUserToProject(
    req.body.projectId,
    req.body.newUserId,
    req.body.role
  );
  res.send(user);
});

// controller to remove single user from project
const removeUserFromProject = catchAsync(async (req, res) => {
  const user = await projectServices.removeUserFromProject(
    req.body.projectId,
    req.loggedInUserId,
    req.body.userId
  );
  res.send(user);
});

// controller to update single user role in project
const updateUserRoleInProject = catchAsync(async (req, res) => {
  const user = await projectServices.updateUserRoleInProject(
    req.body.projectId,
    req.loggedInUserId,
    req.body.userId,
    req.body.role
  );
  res.send(user);
});


// controller to get all users of a single project
const getUsersOfProject = catchAsync(async (req, res) => {
  const users = await projectServices.getUsersOfProject(req.params.projectId);
  res.send(users);
});

// controller to get project user
const getProjectUser = catchAsync(async (req, res) => {
  const user = await projectServices.getProjectUser(
    req.params.projectId,
    req.loggedInUserId
  );
  res.send(user);
});

export {
  createProject,
  updateProject,
  findAllProjects,
  findProjectById,
  addUserToProject,
  getUsersOfProject,
  uploadFileController,
  removeUserFromProject,
  updateUserRoleInProject,
  getExcelController,
  getProjectUser,
};
