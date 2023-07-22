import catchAsync from "../utils/general/catch-async.js";
import * as authService from "../services/auth.service.js";

// controller to register a user
const register = catchAsync(async (req, res) => {
  const response = await authService.register(req.body);
  res.send(response);
});

// controller to login a user
const login = catchAsync(async (req, res) => {
  const response = await authService.login(req.body);
  res.send(response);
});

export { register, login };
