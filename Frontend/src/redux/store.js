import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import requestReducer from "./slices/requestSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
