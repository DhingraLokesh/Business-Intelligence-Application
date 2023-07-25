import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import requestReducer from "./slices/requestSlice";
import commentReducer from "./slices/commentSlice";
import tokenExpirationMiddleware from "./middlewares/auth";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    request: requestReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

export default store;
