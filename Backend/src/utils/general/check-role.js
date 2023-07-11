import {
  projectModel,
  projectUserModel,
  userModel,
} from "../../models/index.js";
import ApiError from "../api-error/index.js";

const checkRole = async (projectId, userId, rolesArray) => {
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const projectUser = await projectUserModel.findOne({
    user: userId,
    project: projectId,
  });

  if (!projectUser) {
    throw new ApiError(400, "User not found in project");
  }

  return rolesArray.some((r) => projectUser.role === r);
};

export default checkRole;
