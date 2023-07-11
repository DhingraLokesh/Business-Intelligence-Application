import express from "express";
import cors from "cors";
import routes from "./routes/v1/index.js";
import ApiError from "./utils/api-error/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/v1", routes);

app.use(errorConverter);
app.use(errorHandler);

app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

export default app;
