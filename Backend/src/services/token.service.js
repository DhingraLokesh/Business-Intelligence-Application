import jwt from "jsonwebtoken";
import config from "../configuration/config-variables/index.js";

// util function to generate token
const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
  };

  return jwt.sign(payload, secret);
};

// service to generate auth token
const generateAuthTokens = async (user) => {
  const currentDate = new Date();
  const accessTokenExpires = new Date(
    currentDate.getTime() + config.jwt.accessExpirationMinutes * 60 * 1000
  );
  const accessToken = generateToken(user.id, accessTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toISOString(),
    },
  };
};

export { generateToken, generateAuthTokens };
