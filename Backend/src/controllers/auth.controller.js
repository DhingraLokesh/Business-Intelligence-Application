import catchAsync from "../utils/general/catch-async.js";
import * as authService from "../services/auth.service.js";

const register = catchAsync(async (req, res) => {
  const response = await authService.register(req.body);
  res.send(response);
});

const login = catchAsync(async (req, res) => {
  const response = await authService.login(req.body);
  res.send(response);
});

export { register, login };
