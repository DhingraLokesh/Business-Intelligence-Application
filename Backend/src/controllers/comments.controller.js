import catchAsync from "../utils/general/catch-async.js";
import * as commentServices from "../services/comment.service.js";

// controller to add comment to a project
const addCommentsOfProject = catchAsync(async (req, res) => {
  const comment = await commentServices.addCommentsOfProject(
    req.body.projectId,
    req.loggedInUserId,
    req.body.message
  );
  res.send(comment);
});

// controller to get comments of a project
const getCommentsOfProject = catchAsync(async (req, res) => {
  const comments = await commentServices.getCommentsOfProject(
    req.params.projectId
  );
  res.send(comments);
});

export { addCommentsOfProject, getCommentsOfProject };
