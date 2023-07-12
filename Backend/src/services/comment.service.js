import { commentModel, projectModel } from "../models/index.js";
import checkRole from "../utils/general/check-role.js";
import ApiError from "../utils/api-error/index.js";

// add comment to a project
const addCommentsOfProject = async (projectId, userId, message) => {
  const resp = await checkRole(projectId, userId, ["owner", "editor", "commentor"]);

  if (!resp) {
    throw new ApiError(401, "Unauthorized !!");
  }
  const comment = await commentModel();
  comment.user = userId;
  comment.project = projectId;
  comment.message = message;
  await comment.save();
  if (!comment) {
    throw new ApiError(500, "Internal Sever Error");
  }

  return comment;
};

// get comments of a project
const getCommentsOfProject = async (projectId) => {
  const comments = await commentModel
    .find({ project: projectId })
    .sort("createdAt")
    .populate([
      {
        path: "user",
        model: "User",
        select: "name",
      },
    ]);
  return comments;
};

export { addCommentsOfProject, getCommentsOfProject };
