import catchAsync from "../utils/general/catch-async.js";
import * as userService from "../services/user.service.js";

const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await userService.getAllUsers();
  res.send(allUsers);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.loggedInUserId);
  res.send(user);
});

const getAnyUserById = catchAsync(async (req, res) => {
  const user = await userService.getAnyUserById(req.params.userId);
  res.send(user);
});

const getUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.query.email);
  res.send(user);
});

const updateUserById = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.loggedInUserId, req.body);
  res.send(user);
});

const deleteUserById = catchAsync(async (req, res) => {
  const allUsers = await userService.deleteUserById(req.loggedInUserId);
  res.send(allUsers);
});

// get all projects of user
const getUsersProject = catchAsync(async (req, res) => {
  const users = await userService.getUsersProject(req.loggedInUserId);
  res.send(users);
});
export {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUsersProject,
  getAnyUserById,
  getUserByEmail,
};
