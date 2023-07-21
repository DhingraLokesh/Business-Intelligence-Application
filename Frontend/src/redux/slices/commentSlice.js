import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  allComments: {
    data: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  newComment: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addCommentSocket: (state, action) => {
      state.allComments.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllComments.pending, (state) => {
        state.allComments.loadingMessage = "Getting all comments ...";
        state.allComments.errorMessage = null;
        state.allComments.loading = true;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.allComments.data = action.payload;
        state.allComments.loading = false;
        state.allComments.loadingMessage = null;
        state.allComments.errorMessage = null;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.allComments.loading = false;
        state.allComments.errorMessage = action?.payload?.message;
      })
      .addCase(addComment.pending, (state) => {
        state.newComment.loadingMessage = "Adding a comment ...";
        state.newComment.errorMessage = null;
        state.newComment.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.newComment.loading = false;
        state.newComment.loadingMessage = null;
        state.newComment.errorMessage = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.newComment.loading = false;
        state.newComment.errorMessage = action?.payload?.message;
      });
  },
});

export const getAllComments = createAsyncThunk(
  "comments/getAllComments",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get(`comments/get/${payload}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("comments/add", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const { addCommentSocket } = commentSlice.actions;
export default commentSlice.reducer;
