import { projectUserModel, userModel } from "../models/index.js";
import ApiError from "../utils/api-error/index.js";

const getUserById = async (userId) => {
  const user = await userModel.findById(userId, { password: 0 });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const getAnyUserById = async (userId) => {
  const user = await userModel.findById(userId, { password: 0 });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const createUser = async (body) => {
  const newUser = await userModel.create(body);
  if (!newUser) throw new ApiError(500, "Internal Server error");
  return newUser;
};

const getAllUsers = async () => {
  const users = await userModel.find({}, { password: 0 });
  if (!users) throw new ApiError(404, "Internal Server error");
  return users;
};

const updateUserById = async (userId, body) => {
  const user = await userModel.findByIdAndUpdate(userId, body);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const deleteUserById = async (userId) => {
  const user = await userModel.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const getUserByEmail = async (email, wantPassword = false) => {
  const user = await userModel.findOne(
    { email },
    !wantPassword && { password: 0 }
  );
  return user;
};

// get all projects of user
const getUsersProject = async (userId) => {
  const projects = await projectUserModel.find({ user: userId }).populate("project");
  if (!projects) {
    throw new ApiError(404, "No Projects Found");
  }

  return projects;
};

export {
  getUserById,
  createUser,
  updateUserById,
  getAllUsers,
  deleteUserById,
  getUserByEmail,
  getUsersProject,
  getAnyUserById,
};
