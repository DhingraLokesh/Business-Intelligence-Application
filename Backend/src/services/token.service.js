import jwt from "jsonwebtoken";
import config from "../configuration/config-variables/index.js";
import ApiError from "../utils/api-error/index.js";
import { tokenModel } from "../models/index.js";

// util function to generate token
const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
  };

  return jwt.sign(payload, secret);
};

// util function to save token
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDetails = {
    token,
    user: userId,
    expires: expires,
    type,
    blacklisted,
  };
  const tokenDoc = await tokenModel.create(tokenDetails);

  if (!tokenDoc) {
    throw new ApiError(500, "Error in saving token");
  }

  return tokenDoc;
};

// util function to verify token
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const filterBody = { token, type, user: payload.userId, blacklisted: false };

  const tokenDoc = await tokenModel.findOne(filterBody);

  if (!tokenDoc) {
    throw new ApiError(404, "token not found");
  }

  return tokenDoc;
};

// service to generate auth token
const generateAuthTokens = async (user) => {
  const currentDate = new Date();
  const accessTokenExpires = new Date(
    currentDate.getTime() + config.jwt.accessExpirationMinutes * 60 * 1000
  );
  const accessToken = generateToken(user.id, accessTokenExpires);

  await saveToken(accessToken, user.id, accessTokenExpires, "access");

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toISOString(),
    }
  };
};

export { generateToken, saveToken, verifyToken, generateAuthTokens };
