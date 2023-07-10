import mongoose, { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";
import { projectUserRoles } from "../configuration/roles/index.js";

const projectUserSchema = new Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: projectUserRoles,
      default: "viewer",
    },
  },
  {
    timestamps: true,
  }
);

projectUserSchema.plugin(toJSON);

const projectUserModel = mongoose.model("ProjectUser", projectUserSchema);

export default projectUserModel;
