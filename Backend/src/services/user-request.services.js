import { userRequestModel, userModel } from "../models/index.js";
import ApiError from "../utils/api-error/index.js";
import checkRole from "../utils/general/check-role.js";
import { addUserToProject } from "./project.services.js";
import { io } from "../app.js";

// service to send request to join project
const sendRequestToJoinProject = async (sender, projectId, role, receiver) => {
  const resp = await checkRole(projectId, sender, ["owner"]);

  if (!resp) {
    throw new ApiError(401, "Unauthorized !!");
  }

  const user = await userModel.findById(receiver);

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const reqExists = await userRequestModel
    .find({ to: receiver, from: sender, project: projectId, role: role })
    .sort({ $natural: -1 })
    .limit(1);

  if (reqExists.length !== 0) {
    if (reqExists[0].state === "pending")
      throw new ApiError(400, "Request Already Exists");
    else if (reqExists[0].state === "accepted")
      throw new ApiError(400, "Request Already Accepted");
  }

  const userRequest = await userRequestModel();
  userRequest.from = sender;
  userRequest.to = receiver;
  userRequest.role = role;
  userRequest.project = projectId;
  await userRequest.save();

  if (!userRequest) {
    throw new ApiError(500, "Internal Sever Error");
  }

  const request = await getRequestById(userRequest.id, true);
  const roomName = `user-${receiver}`;
  io.to(roomName).emit("requestFromServer", request);

  return userRequest;
};

// service to accept request to join project
const acceptRequestToJoinProject = async (requestId) => {
  const userRequest = await userRequestModel.findById(requestId);

  if (!userRequest) {
    throw new ApiError(404, "Request Not Found");
  }

  const sender = await userModel.findById(userRequest.from);

  if (!sender) {
    throw new ApiError(404, "User Not Found");
  }

  userRequest.state = "accepted";
  await userRequest.save();

  const user = await addUserToProject(
    userRequest.project,
    userRequest.to,
    userRequest.role
  );

  if (!user) {
    throw new ApiError(500, "Internal Sever Error");
  }

  return userRequest;
};

// service to reject request to join project
const rejectRequestToJoinProject = async (requestId) => {
  const userRequest = await userRequestModel.findById(requestId);

  if (!userRequest) {
    throw new ApiError(404, "Request Not Found");
  }

  const sender = await userModel.findById(userRequest.from);

  if (!sender) {
    throw new ApiError(404, "User Not Found");
  }

  userRequest.state = "rejected";
  await userRequest.save();

  return userRequest;
};

// service to get all requests and divide it based on state like pending, accepted, rejected
const getAllRequests = async (userId) => {
  const sentRequests = await userRequestModel
    .find({
      from: userId,
    })
    .populate([
      {
        path: "to",
        model: "User",
        select: "firstName lastName username email",
      },
      {
        path: "project",
        model: "Project",
      },
    ]);

  const receivedRequests = await userRequestModel
    .find({
      to: userId,
    })
    .populate([
      {
        path: "from",
        model: "User",
        select: "firstName lastName username email",
      },
      {
        path: "project",
        model: "Project",
      },
    ]);

  return {
    sentRequests,
    receivedRequests,
  };
};

const getRequestById = async (requestId, isFrom = true) => {
  const request = await userRequestModel.findById(requestId).populate([
    {
      path: isFrom ? "from" : "to",
      model: "User",
      select: "firstName lastName username email",
    },
    {
      path: "project",
      model: "Project",
    },
  ]);

  return request;
};

export {
  sendRequestToJoinProject,
  acceptRequestToJoinProject,
  rejectRequestToJoinProject,
  getAllRequests,
  getRequestById,
};
