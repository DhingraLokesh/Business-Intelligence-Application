import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import requestReducer from "./slices/requestSlice";
import commentReducer from "./slices/commentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    request: requestReducer,
    comment: commentReducer,
  },
});

export default store;
