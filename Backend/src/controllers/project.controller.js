import catchAsync from "../utils/general/catch-async.js";
import * as projectServices from "../services/project.services.js";

// create project
const createProject = catchAsync(async (req, res) => {
  const project = await projectServices.createProject(
    req.loggedInUserId,
    req.body
  );
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
    req.loggedInUserId,
    req.body.userId,
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
  findAllProjects,
  findProjectById,
  addUserToProject,
  getUsersOfProject,
  getUsersOfProjectByRole,
  removeUserFromProject,
  updateUserRoleInProject,
};
