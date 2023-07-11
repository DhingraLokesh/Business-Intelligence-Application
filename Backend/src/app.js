import express from "express";
import cors from "cors";
import passport from "passport";
import { jwtStrategy } from "./configuration/passport/index.js";
import routes from "./routes/v1/index.js";
import ApiError from "./utils/api-error/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// v1 api routes
app.use("/api/v1", routes);

app.use(errorConverter);
app.use(errorHandler);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

export default app;
