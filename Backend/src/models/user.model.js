import mongoose, { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";
import bcrypt from "bcrypt";
import validator from "validator";

const usersSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate(val) {
        if (!validator.isEmail(val)) throw new Error("Invalid Email");
      },
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.plugin(toJSON);

usersSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

usersSchema.method({
  async authenticate(password) {
    return bcrypt.compare(password, this.password);
  },
});

const userModel = mongoose.model("User", usersSchema);

export default userModel;
