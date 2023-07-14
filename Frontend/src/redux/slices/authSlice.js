import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  token: null,
  user: {},
  allUsers: [],
  loggedIn: false,
  loading: false,
  error: false,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "Signing up...";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
        localStorage.setItem("token", action.payload.tokens.access.token);
        state.loggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "Signing in...";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
        localStorage.setItem("token", action.payload.tokens.access.token);
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
      })
  },
});

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("/auth/register", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("/auth/login", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export default authSlice.reducer;
