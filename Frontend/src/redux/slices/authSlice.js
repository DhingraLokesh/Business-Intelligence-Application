import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  token: null,
  user: {
    data: {},
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  userImage: {
    data: null,
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  allUsers: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  login: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  logout: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  register: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  loggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user.data = {};
      state.loggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.loadingMessage = "Signing up ...";
        state.register.errorMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.user.data = action.payload.user;
        state.token = action.payload.tokens.access.token;
        localStorage.setItem("token", action.payload.tokens.access.token);
        state.loggedIn = true;
        state.register.loadingMessage = null;
        state.register.errorMessage = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.loadingMessage = null;
        state.register.errorMessage = action?.payload?.message;
      })
      .addCase(login.pending, (state) => {
        state.login.loading = true;
        state.login.loadingMessage = "Signing in ...";
        state.login.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.user.data = action.payload.user;
        state.token = action.payload.tokens.access.token;
        localStorage.setItem("token", action.payload.tokens.access.token);
        state.loggedIn = true;
        state.login.loadingMessage = null;
        state.login.errorMessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.register.loadingMessage = null;
        state.login.errorMessage = action?.payload?.message;
      })
      .addCase(getUser.pending, (state) => {
        state.user.loading = true;
        state.user.loadingMessage = "Getting user ...";
        state.user.errorMessage = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.data = action.payload;
        state.user.loadingMessage = null;
        state.user.errorMessage = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.errorMessage = action?.payload?.message;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.allUsers.loading = true;
        state.allUsers.loadingMessage = "Getting all users ...";
        state.allUsers.errorMessage = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers.loading = false;
        state.allUsers.data = action.payload;
        state.allUsers.loadingMessage = null;
        state.allUsers.errorMessage = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.allUsers.loading = false;
        state.allUsers.errorMessage = action?.payload?.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.user.loading = true;
        state.user.loadingMessage = "Updating user ...";
        state.user.errorMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.loadingMessage = null;
        state.user.errorMessage = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.user.loading = false;
        state.user.errorMessage = action?.payload?.message;
      })
      .addCase(uploadImage.pending, (state) => {
        state.user.loading = true;
        state.user.loadingMessage = "Uploading user image ...";
        state.user.errorMessage = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.user.loading = false;
        state.user.loadingMessage = null;
        state.user.errorMessage = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.user.loading = false;
        state.user.errorMessage = action?.payload?.message;
      })
      .addCase(getImage.pending, (state) => {
        state.userImage.loading = true;
        state.userImage.loadingMessage = "Getting user image ...";
        state.userImage.errorMessage = null;
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.userImage.loading = false;
        state.userImage.data = action.payload;
        state.userImage.loadingMessage = null;
        state.userImage.errorMessage = null;
      })
      .addCase(getImage.rejected, (state, action) => {
        state.userImage.loading = false;
        state.userImage.errorMessage = action?.payload?.message;
      });
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

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().patch("/users/update", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get("/users/get");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get("/users/get-all");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios(false).post("/users/upload", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getImage = createAsyncThunk(
  "auth/getImage",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get("/users/getImage");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
