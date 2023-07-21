import { commentModel } from "../models/index.js";
import checkRole from "../utils/general/check-role.js";
import ApiError from "../utils/api-error/index.js";
import { io } from "../app.js";

// service to add comment to a project
const addCommentsOfProject = async (projectId, userId, message) => {
  const resp = await checkRole(projectId, userId, [
    "owner",
    "editor",
    "commentor",
  ]);

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

  const commentById = await getCommentById(comment.id);

  const roomName = `project-${projectId}`;
  io.in(roomName).emit("commentFromServer", commentById);

  return comment;
};

// service to get comments of a project
const getCommentsOfProject = async (projectId) => {
  const comments = await commentModel
    .find({ project: projectId })
    .sort("createdAt")
    .populate([
      {
        path: "user",
        model: "User",
        select: "username",
      },
    ]);
  return comments;
};

const getCommentById = async (commentId) => {
  const comment = await commentModel
    .findById(commentId)
    .populate([
      {
        path: "user",
        model: "User",
        select: "username",
      },
    ]);
  return comment;
};

export { addCommentsOfProject, getCommentsOfProject };
