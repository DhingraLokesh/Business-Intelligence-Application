import { projectUserModel, projectModel, userModel } from "../models/index.js";
import ApiError from "../utils/api-error/index.js";
import checkRole from "../utils/general/check-role.js";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";

// service to create project
const createProject = async (userId, body) => {
  const newProject = await projectModel.create({...body, owner: userId});

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

// service to update project
const updateProject = async (body) => {
  const { projectId } = body;
  const project = await projectModel.findByIdAndUpdate(projectId, body);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

// service to get all projects in DB
const findAllProjects = async () => {
  const projects = await projectModel.find();
  if (!projects) {
    throw new ApiError(404, "No Project Found");
  }

  return projects;
};

// service to get single project with id
const findProjectById = async (projectId) => {
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }
  return project;
};

// service to add single user to project with role
const addUserToProject = async (projectId, newUserId, role) => {
  const projectUser = await projectUserModel.findOne({
    user: newUserId,
    project: projectId,
  });

  if (projectUser) {
    throw new ApiError(400, "User already in project");
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

// service to remove single user to project with role
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

// service to remove single user to project with role
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

// service to get all users of a single project
const getUsersOfProject = async (projectId) => {
  const ProjectUsers = await projectUserModel
    .find({ project: projectId })
    .populate([
      {
        path: "user",
        model: "User",
        select: "firstName lastName email username",
      },
    ]);
  if (!ProjectUsers) {
    throw new ApiError(404, "No User Found");
  }
  return ProjectUsers;
};

// service to get project user
const getProjectUser = async (projectId, userId) => {
  const projectUser = await projectUserModel.findOne({
    project: projectId,
    user: userId,
  });

  if (!projectUser) {
    throw new ApiError(404, "No User Found");
  }
  return projectUser;
};
// service to get excel file corresponding to project
const getExcel = async (projectId) => {
  const excelPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "../upload",
    `${projectId}`
  );
  const supportedExtensions = [".csv", ".xls", ".xlsx"];
  const excelFile = supportedExtensions.find((extension) =>
    fs.existsSync(`${excelPath}${extension}`)
  );

  if (!excelFile) {
    throw new ApiError(404, "Excel not found");
  }

  const workbook = xlsx.readFile(`${excelPath}${excelFile}`);

  // Read the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the sheet data to JSON
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  console.log("Excel file converted to JSON.");
  return jsonData;
};

export {
  createProject,
  updateProject,
  findAllProjects,
  findProjectById,
  addUserToProject,
  getUsersOfProject,
  removeUserFromProject,
  updateUserRoleInProject,
  getExcel,
  getProjectUser,
};
