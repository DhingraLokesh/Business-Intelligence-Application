import mongoose, { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";
import { projectUserRoles } from "../configuration/roles/index.js";

const userRequestSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    role: {
      type: String,
      enum: projectUserRoles,
      default: "viewer",
    },
    state: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

userRequestSchema.plugin(toJSON);

const userRequestModel = mongoose.model("UserRequest", userRequestSchema);

export default userRequestModel;
