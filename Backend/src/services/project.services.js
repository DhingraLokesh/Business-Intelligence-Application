import { projectUserModel, projectModel } from "../models/index.js";
import ApiError from "../utils/api-error/index.js";
import checkRole from "../utils/general/check-role.js";

// create project
const createProject = async (userId, body) => {
  const newProject = await projectModel.create(body);

  if (!newProject) {
    throw new ApiError(500, "Internal Sever Error");
  }
  const projectUser = await projectUserModel();
  projectUser.user = userId;
  projectUser.role = "owner";
  projectUser.project = newProject.id;
  await projectUser.save();

  if (!projectUser) {
    throw new ApiError(500, "Internal Sever Error");
  }
  return newProject;
};

// get all projects in DB
const findAllProjects = async () => {
  const projects = await projectModel.find();
  if (!projects) {
    throw new ApiError(404, "No Project Found");
  }
  return projects;
};

// get single project with id
const findProjectById = async (projectId) => {
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }
  return project;
};

// add single user to project with role
const addUserToProject = async (projectId, userId, newUserId, role) => {
  const resp = await checkRole(projectId, userId, ["owner"]);

  if (!resp) {
    throw new ApiError(401, "Unauthorized !!");
  }

  const projectUser = await projectUserModel.findOne({
    user: newUserId,
    project: projectId,
  });
  if (projectUser) {
    throw new ApiError(400, "User Already added in the project");
  }

  const newProjectUser = await projectUserModel();
  newProjectUser.project = projectId;
  newProjectUser.user = newUserId;
  newProjectUser.role = role;
  await newProjectUser.save();

  if (!newProjectUser) {
    throw new ApiError(500, "Internal Sever Error");
  }

  return newProjectUser;
};

// remove single user to project with role
const removeUserFromProject = async (projectId, userId, newUserId) => {
  const resp = await checkRole(projectId, userId, ["owner"]);

  if (!resp) {
    throw new ApiError(401, "Unauthorized !!");
  }

  const projectUser = await projectUserModel.findOne({
    user: newUserId,
    project: projectId,
  });
  if (!projectUser) {
    throw new ApiError(400, "User not found in project");
  }

  const deletedProjectUser = await projectUserModel.findByIdAndDelete(
    projectUser.id
  );

  return deletedProjectUser;
};

// remove single user to project with role
const updateUserRoleInProject = async (
  projectId,
  userId,
  newUserId,
  newRole
) => {
  const resp = await checkRole(projectId, userId, ["owner"]);

  if (!resp) {
    throw new ApiError(401, "Unauthorized !!");
  }

  const projectUser = await projectUserModel.findOne({
    user: newUserId,
    project: projectId,
  });
  if (!projectUser) {
    throw new ApiError(400, "User not found in project");
  }

  projectUser.role = newRole;
  projectUser.save();

  return projectUser;
};

// get users of project according to role
const getUsersOfProjectByRole = async (projectId, role) => {
  const ProjectUsers = await projectUserModel.find({
    role,
    project: projectId,
  });
  if (!ProjectUsers) {
    throw new ApiError(404, "No users found");
  }

  return ProjectUsers;
};

// get all users of a single project
const getUsersOfProject = async (projectId) => {
  const ProjectUsers = await projectUserModel.find({ project: projectId });
  if (!ProjectUsers) {
    throw new ApiError(404, "No User Found");
  }
  return ProjectUsers;
};

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
