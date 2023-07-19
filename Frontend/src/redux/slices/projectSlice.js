import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  allUserProjects: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  allProjectUsers: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  currentProject: {
    data: {},
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  excel: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  projectUser: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  newProject: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.newProject.loading = true;
        state.newProject.loadingMessage = "Creating a new project ...";
        state.newProject.errorMessage = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.newProject.loading = false;
        state.newProject.loadingMessage = null;
        state.newProject.errorMessage = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.newProject.loading = false;
        state.newProject.errorMessage = action?.payload?.message;
      })
      .addCase(getAllProjectsOfUser.pending, (state) => {
        state.allUserProjects.loading = true;
        state.allUserProjects.loadingMessage = "Getting all user projects ...";
        state.allUserProjects.errorMessage = null;
      })
      .addCase(getAllProjectsOfUser.fulfilled, (state, action) => {
        state.allUserProjects.loading = false;
        state.allUserProjects.data = action.payload;
        state.allUserProjects.loadingMessage = null;
        state.allUserProjects.errorMessage = null;
      })
      .addCase(getAllProjectsOfUser.rejected, (state, action) => {
        state.allUserProjects.loading = false;
        state.allUserProjects.errorMessage = action?.payload?.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.currentProject.loading = true;
        state.currentProject.loadingMessage = "Updating project ...";
        state.currentProject.errorMessage = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.currentProject.loading = false;
        state.currentProject.loadingMessage = null;
        state.currentProject.errorMessage = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.currentProject.loading = false;
        state.currentProject.errorMessage = action?.payload?.message;
      })
      .addCase(getAllUsersOfProject.pending, (state) => {
        state.allProjectUsers.loading = true;
        state.allProjectUsers.loadingMessage = "Getting all project users ...";
        state.allProjectUsers.errorMessage = null;
      })
      .addCase(getAllUsersOfProject.fulfilled, (state, action) => {
        state.allProjectUsers.loading = false;
        state.allProjectUsers.data = action.payload;
        state.allProjectUsers.loadingMessage = null;
        state.allProjectUsers.errorMessage = null;
      })
      .addCase(getAllUsersOfProject.rejected, (state, action) => {
        state.allProjectUsers.loading = false;
        state.allProjectUsers.errorMessage = action?.payload?.message;
      })
      .addCase(getProjectById.pending, (state) => {
        state.currentProject.loading = true;
        state.currentProject.loadingMessage = "Getting project ...";
        state.currentProject.errorMessage = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.currentProject.loading = false;
        state.currentProject.data = action.payload;
        state.currentProject.loadingMessage = null;
        state.currentProject.errorMessage = null;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.currentProject.loading = false;
        state.currentProject.errorMessage = action?.payload?.message;
      })
      .addCase(getExcel.pending, (state) => {
        state.excel.loading = true;
        state.excel.loadingMessage = "Getting excel ...";
        state.excel.errorMessage = null;
      })
      .addCase(getExcel.fulfilled, (state, action) => {
        state.excel.loading = false;
        state.excel.data = action.payload;
        state.excel.loadingMessage = null;
        state.excel.errorMessage = null;
      })
      .addCase(getExcel.rejected, (state, action) => {
        state.excel.loading = false;
        state.excel.errorMessage = action?.payload?.message;
      })
      .addCase(getProjectUser.pending, (state) => {
        state.projectUser.loading = true;
        state.projectUser.loadingMessage = "Getting project user ...";
        state.projectUser.errorMessage = null;
      })
      .addCase(getProjectUser.fulfilled, (state, action) => {
        state.projectUser.loading = false;
        state.projectUser.data = action.payload;
        state.projectUser.loadingMessage = null;
        state.projectUser.errorMessage = null;
      })
      .addCase(getProjectUser.rejected, (state, action) => {
        state.projectUser.loading = false;
        state.projectUser.errorMessage = action?.payload?.message;
      });
  },
});

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("/projects/create", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadExcel = createAsyncThunk(
  "projects/uploadExcel",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios(false).post(
        `/projects/upload/${payload.projectId}`,
        payload.formData
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getProjectUser = createAsyncThunk(
  "projects/getProjectUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get(`/projects/get-user/${payload}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getProjectById = createAsyncThunk(
  "projects/getProjectById",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get(`/projects/get/${payload}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().patch("/projects/update", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllProjectsOfUser = createAsyncThunk(
  "projects/getAllProjectsOfUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get("/users/get-all-projects");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllUsersOfProject = createAsyncThunk(
  "projects/getAllUsersOfProject",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get(`projects/get-users/${payload}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addProjectUser = createAsyncThunk(
  "projects/addProjectUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("projects/add-user", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProjectUserRole = createAsyncThunk(
  "projects/updateProjectUserRole",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().patch(
        "projects/update-user-role",
        payload
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteProjectUser = createAsyncThunk(
  "projects/deleteProjectUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().delete("projects/remove-user", {
        data: payload,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getExcel = createAsyncThunk(
  "projects/getExcel",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get(`/projects/get-excel/${payload}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export default projectSlice.reducer;
