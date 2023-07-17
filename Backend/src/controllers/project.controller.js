import catchAsync from "../utils/general/catch-async.js";
import * as projectServices from "../services/project.services.js";
import { uploadFile } from "../utils/general/multer.js";
import ApiError from "../utils/api-error/index.js";
// create project
const createProject = catchAsync(async (req, res) => {
  console.log(req.body);
  const project = await projectServices.createProject(
    req.loggedInUserId,
    req.body
  );

  res.send(project);
});

// upload File
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

// get File
const getExcelController = catchAsync(async (req, res) => {
  try {
    const excel = await projectServices.getExcel(req.params.projectId);
    res.send(excel);
  } catch (error) {
    console.log("error getting excel ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});

// update project
const updateProject = catchAsync(async (req, res) => {
  const project = await projectServices.updateProject(req.body);
  res.send(project);
});

// get all projects in DB
const findAllProjects = catchAsync(async (req, res) => {
  const projects = await projectServices.findAllProjects();
  res.send(projects);
});

// get single project with id
const findProjectById = catchAsync(async (req, res) => {
  const project = await projectServices.findProjectById(req.params.projectId);
  res.send(project);
});

// add single user to project with role
const addUserToProject = catchAsync(async (req, res) => {
  const user = await projectServices.addUserToProject(
    req.body.projectId,
    req.body.newUserId,
    req.body.role
  );
  res.send(user);
});

// remove single user from project
const removeUserFromProject = catchAsync(async (req, res) => {
  const user = await projectServices.removeUserFromProject(
    req.body.projectId,
    req.loggedInUserId,
    req.body.userId
  );
  res.send(user);
});

// update single user role in project
const updateUserRoleInProject = catchAsync(async (req, res) => {
  const user = await projectServices.updateUserRoleInProject(
    req.body.projectId,
    req.loggedInUserId,
    req.body.userId,
    req.body.role
  );
  res.send(user);
});

// get users of project according to role
const getUsersOfProjectByRole = catchAsync(async (req, res) => {
  const users = await projectServices.getUsersOfProjectByRole(
    req.query.projectId,
    req.query.role
  );
  res.send(users);
});

// get all users of a single project
const getUsersOfProject = catchAsync(async (req, res) => {
  const users = await projectServices.getUsersOfProject(req.params.projectId);
  res.send(users);
});

export {
  createProject,
  updateProject,
  findAllProjects,
  findProjectById,
  addUserToProject,
  getUsersOfProject,
  uploadFileController,
  getUsersOfProjectByRole,
  removeUserFromProject,
  updateUserRoleInProject,
  getExcelController,
};
