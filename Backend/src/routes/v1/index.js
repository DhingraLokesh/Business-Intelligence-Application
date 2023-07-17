import express from "express";

import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./projects.routes.js";
import commentRoutes from "./comments.routes.js";
import userRequestRoutes from "./user-request.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/requests", userRequestRoutes);
router.use("/projects", projectRoutes);
router.use("/comments", commentRoutes);

export default router;
