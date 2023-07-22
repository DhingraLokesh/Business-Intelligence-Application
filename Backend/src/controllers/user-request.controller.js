import catchAsync from "../utils/general/catch-async.js";
import * as userRequestServices from "../services/user-request.services.js";

// controller to send request to a user to join a project
const sendRequestToJoinProject = catchAsync(async (req, res) => {
  const { projectId, role, receiver } = req.body;
  const userRequest = await userRequestServices.sendRequestToJoinProject(
    req.loggedInUserId,
    projectId,
    role,
    receiver
  );
  res.status(200).send(userRequest);
});

// controller to handle request sent by a user to join a project
const handleRequestToJoinProject = catchAsync(async (req, res) => {
  const { requestId, isAccept } = req.body;
  const userRequest = isAccept
    ? await userRequestServices.acceptRequestToJoinProject(requestId)
    : await userRequestServices.rejectRequestToJoinProject(requestId);
  res.status(200).send(userRequest);
});

// controller to get all requests sent by user and sent to user
const getAllRequests = catchAsync(async (req, res) => {
  const userRequests = await userRequestServices.getAllRequests(
    req.loggedInUserId
  );
  res.status(200).send(userRequests);
});

export { sendRequestToJoinProject, handleRequestToJoinProject, getAllRequests };
