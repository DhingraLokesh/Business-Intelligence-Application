import ApiError from "../utils/api-error/index.js";
import * as userService from "./user.service.js";
import * as tokenService from "./token.service.js";
import bcrypt from "bcrypt";

// service to handle register request
const register = async (registerBody) => {
  registerBody.password = await bcrypt.hash(registerBody.password, 10);

  let checkUser = await userService.getUserByEmail(registerBody.email);

  if (checkUser) {
    throw new ApiError(400, "User email already registered");
  }

  checkUser = await userService.getUserByUsername(registerBody.username);

  if (checkUser) {
    throw new ApiError(400, "Username already registered");
  }

  const user = await userService.createUser(registerBody);
  const tokens = await tokenService.generateAuthTokens(user);

  return {
    user,
    tokens,
  };
};

// service to handle login request
const login = async (loginBody) => {
  const user = await userService.getUserByEmail(loginBody.email, true);

  if (!user) {
    throw new ApiError(404, "user not exists !!");
  }

  if (await user.authenticate(loginBody.password)) {
    const tokens = await tokenService.generateAuthTokens(user);

    return {
      user,
      tokens,
    };
  } else {
    throw new ApiError(401, "user credentials not matching !!");
  }
};

export { register, login };
