import passport from "passport";
import ApiError from "../utils/api-error/index.js";

// middleware to verify the callback whether the user is authenticated or not
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(400, info?.message || "Please authenticate"));
  }

  req.loggedInUserId = user._id;
  resolve();
};

// middleware to auth user
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
