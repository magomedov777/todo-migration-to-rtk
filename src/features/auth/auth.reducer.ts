import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { handleServerAppError } from "utils/handle-server-app-error";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { authAPI, LoginParamsType } from "./auth.api";
import { createAppAsyncThunk, ResultCode } from "utils";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

const login = createAppAsyncThunk("auth/me", async (arg: LoginParamsType, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAppAsyncThunk("auth/logout", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.success) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(clearTasksAndTodolists());
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const authThunk = { login, logout };
