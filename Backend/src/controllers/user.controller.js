import catchAsync from "../utils/general/catch-async.js";
import * as userService from "../services/user.service.js";
import { uploadFile } from "../utils/general/multer.js";
import ApiError from "../utils/api-error/index.js";

// controller to get all users
const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await userService.getAllUsers();
  res.send(allUsers);
});

// controller to get user by id (from req.loggedInUserId)
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.loggedInUserId);
  res.send(user);
});

// controller to upload image
const uploadImageController = catchAsync(async (req, res) => {
  try {
    const image = await uploadFile(req, res, req.loggedInUserId);
    res.status(200).send("Image uploaded successfully.");
  } catch (error) {
    console.log("error uploading Image ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});
// controller to get image from uploads folder 
// for sending it to frontend
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

// controller to get image from uploads folder 
// for sending it to frontend
const getPublicImageController = catchAsync(async (req, res) => {
  try {
    const image = await userService.getImage(req.params.userId);
    res.setHeader('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.log("error getting Image ", error);
    throw new ApiError(500, "Internal Sever Error");
  }
});


// controller to get user by id (from req.params.UserId)
const getAnyUserById = catchAsync(async (req, res) => {
  const user = await userService.getAnyUserById(req.params.userId);
  res.send(user);
});

// controller to get user by email
const getUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.query.email);
  res.send(user);
});

// controller to update user
const updateUserById = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.loggedInUserId, req.body);
  res.send(user);
});

// controller to delete user
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
  getPublicImageController,
};
