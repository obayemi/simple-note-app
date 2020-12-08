import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  verifyToken,
  refreshTokenRequest,
} from "../services/auth";
import { TokenPair, Credentials } from "../models/auth";
import axios from "axios";

const apiUrl = "http://127.0.0.1:8001";

export interface AuthState {
  tokens?: TokenPair;
  loading: boolean;
}

const initialState: AuthState = {
  tokens: undefined,
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, thunkAPI) => {
    thunkAPI.dispatch(setLoading());
    const tokens = await loginRequest(credentials);
    localStorage.setItem("tokensPair", JSON.stringify(tokens));
    axios.defaults.headers.common["Authorization"] = `JWT ${tokens.access}`;
    return tokens;
  }
);

export const tryRetrieveTokens = createAsyncThunk(
  "auth/tryRetrieveTokens",
  async () => {
    const raw_tokens = localStorage.getItem("tokensPair");
    if (!raw_tokens) {
      throw Error("no tokens");
    }
    const tokens = JSON.parse(raw_tokens) as TokenPair;
    axios.defaults.headers.common["Authorization"] = `JWT ${tokens.access}`;
    return tokens;
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_: void, thunkAPI) => {
    const state = thunkAPI.getState() as { auth: AuthState };
    const tokens = state.auth.tokens;
    if (!tokens) {
      throw Error("attempt to refresh without token");
    }
    const token = await refreshTokenRequest(tokens.refresh);
    axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
    return {
      access: token,
      refresh: tokens.refresh,
    };
  }
);

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  localStorage.removeItem("tokensPair");
  axios.defaults.headers.common["Authorization"] = undefined;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<TokenPair>) {
      return {
        ...state,
        tokens: action.payload,
      };
    },
    setLoading(state) {
      return { ...state, loading: true };
    },
  },
  extraReducers: {
    [`${login.fulfilled}`]: (
      state: AuthState,
      action: PayloadAction<TokenPair>
    ) => ({
      ...state,
      tokens: action.payload,
      loading: false,
    }),
    [`${login.rejected}`]: (state: AuthState) => ({
      ...state,
      loading: false,
    }),
    [`${tryRetrieveTokens.fulfilled}`]: (
      state: AuthState,
      action: PayloadAction<TokenPair>
    ) => ({
      ...state,
      tokens: action.payload,
    }),
    [`${logout.fulfilled}`]: (state: AuthState) => ({
      ...state,
      tokens: undefined,
    }),
    [`${refreshToken.fulfilled}`]: (
      state: AuthState,
      action: PayloadAction<TokenPair>
    ) => ({
      ...state,
      tokens: action.payload,
    }),
    [`${refreshToken.rejected}`]: (
      state: AuthState,
      action: PayloadAction<TokenPair>
    ) => ({
      ...state,
      tokens: undefined,
    }),
  },
});

export const { setLoading } = authSlice.actions;

export default authSlice.reducer;
