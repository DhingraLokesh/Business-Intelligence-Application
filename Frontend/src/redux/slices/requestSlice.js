import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  allRequests: {
    sentRequests: [],
    receivedRequests: [],
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
  sendRequestSlice: {
    loading: false,
    loadingMessage: null,
    errorMessage: null,
  },
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    receiveSocketRequest(state, action) {
      state.allRequests.receivedRequests.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRequest.pending, (state) => {
        state.sendRequestSlice.loading = true;
        state.sendRequestSlice.loadingMessage = "Sending joining request ...";
        state.sendRequestSlice.errorMessage = null;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.sendRequestSlice.loading = false;
        state.sendRequestSlice.loadingMessage = null;
        state.sendRequestSlice.errorMessage = null;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.sendRequestSlice.loading = false;
        state.sendRequestSlice.errorMessage = action?.payload?.message;
      })
      .addCase(getAllRequests.pending, (state) => {
        state.allRequests.loading = true;
        state.allRequests.loadingMessage = "Getting all requests ...";
        state.allRequests.errorMessage = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.allRequests.loading = false;
        state.allRequests.sentRequests = action.payload.sentRequests;
        state.allRequests.receivedRequests = action.payload.receivedRequests;
        state.allRequests.loadingMessage = null;
        state.allRequests.errorMessage = null;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.allRequests.loading = false;
        state.allRequests.errorMessage = action?.payload?.message;
      });
  },
});

export const sendRequest = createAsyncThunk(
  "requests/sendRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("/requests/send", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const handleRequest = createAsyncThunk(
  "requests/handleRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().post("/requests/handle", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllRequests = createAsyncThunk(
  "requests/getAllRequests",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios().get("/requests/get-all");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const { receiveSocketRequest } = requestSlice.actions;

export default requestSlice.reducer;
