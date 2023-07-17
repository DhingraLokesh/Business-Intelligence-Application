import catchAsync from "../utils/general/catch-async.js";
import * as userRequestServices from "../services/user-request.services.js";

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

const handleRequestToJoinProject = catchAsync(async (req, res) => {
  const { requestId, isAccept } = req.body;
  const userRequest = isAccept
    ? await userRequestServices.acceptRequestToJoinProject(requestId)
    : await userRequestServices.rejectRequestToJoinProject(requestId);
  res.status(200).send(userRequest);
});

const getAllRequests = catchAsync(async (req, res) => {
  const userRequests = await userRequestServices.getAllRequests(
    req.loggedInUserId
  );
  res.status(200).send(userRequests);
});

export { sendRequestToJoinProject, handleRequestToJoinProject, getAllRequests };
