import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchDisposable = createAsyncThunk("products/fetchDisposable", async () => {
  const { data } = await axios.get("/disposable");
  return data;
});

export const fetchReusable = createAsyncThunk("reusable/fetchReusable", async () => {
  const { data } = await axios.get("/reusable");
  return data;
});



const initialState = {
  products: {
    items: [],
    status: "loading",
  },
};

const productsSlice = createSlice({
  name: "disposable",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchDisposable.pending]: (state) => {
      state.products.items = [];
      state.products.status = "loading";
    },
    [fetchDisposable.fulfilled]: (state, action) => {
      state.products.items = action.payload;
      state.products.status = "loaded";
    },
    [fetchDisposable.rejected]: (state) => {
      state.products.items = [];
      state.products.status = "error";
    },
    [fetchReusable.pending]: (state) => {
      state.products.items = [];
      state.products.status = "loading";
    },
    [fetchReusable.fulfilled]: (state, action) => {
      state.products.items = action.payload;
      state.products.status = "loaded";
    },
    [fetchReusable.rejected]: (state) => {
      state.products.items = [];
      state.products.status = "error";
    },
  },
});

export const productReducer = productsSlice.reducer;
