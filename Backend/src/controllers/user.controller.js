import catchAsync from "../utils/general/catch-async.js";
import * as userService from "../services/user.service.js";
import { uploadFile } from "../utils/general/multer.js";
import ApiError from "../utils/api-error/index.js";

const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await userService.getAllUsers();
  res.send(allUsers);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.loggedInUserId);
  res.send(user);
});

// upload File
const uploadImageController = catchAsync(async (req, res) => {
  try {
    const image = await uploadFile(req, res, req.loggedInUserId);
    console.log("Image uploaded", image);
    res.status(200).send("Image uploaded successfully.");
  } catch (error) {
    console.log("error uploading Image ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});
// get File
const getImageController = catchAsync(async (req, res) => {
  try {
    const image = await userService.getImage(req.loggedInUserId);
    res.setHeader('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.log("error getting Image ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
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
  uploadImageController,
  getImageController,
  getUsersProject,
  getAnyUserById,
  getUserByEmail,
};
