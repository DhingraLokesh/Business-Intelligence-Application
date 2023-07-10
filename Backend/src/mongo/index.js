import mongoose from "mongoose";
import config from "../configuration/config-variables/index.js";

const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    console.log("Connected to MongoDB Successfully");
  } catch (err) {
    console.error("Connection Failed");
    console.error(err);
  }
};

const disconnectMongo = async () => {
  await mongoose.disconnect();
};

export { connectMongo, disconnectMongo };
