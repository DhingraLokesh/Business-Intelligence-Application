import express from "express";
import cors from "cors";
import passport from "passport";
import { jwtStrategy } from "./configuration/passport/index.js";
import routes from "./routes/v1/index.js";
import ApiError from "./utils/api-error/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import { Server } from "socket.io";
import http from "http";

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

const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("joinRequestRoom", (userId) => {
    Object.keys(socket.rooms).forEach((room) => {
      socket.leave(room);
    });

    const roomName = `user-${userId}`;
    socket.join(roomName);
    console.log(`Client joined project room: ${roomName}`);
  });

  socket.on("joinCommentRoom", (projectId) => {
    Object.keys(socket.rooms).forEach((room) => {
      socket.leave(room);
    });

    const roomName = `project-${projectId}`;
    socket.join(roomName);
    console.log(`Client joined comment room: ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export {server, io};
