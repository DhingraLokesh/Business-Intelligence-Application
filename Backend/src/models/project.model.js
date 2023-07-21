import mongoose, { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chart: {
      type: {
        type: String,
        enum: ["bar", "line", "pie", "column"],
      },
      xField: {
        type: String,
      },
      yField: {
        type: String,
      },
      title: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
