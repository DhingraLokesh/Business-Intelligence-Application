import mongoose, { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";
import bcrypt from "bcrypt";
import validator from 'validator';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) throw new Error("Invalid Email");
      },
    },
    password: {
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
