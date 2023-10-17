import { AppDispatch, AppRootStateType } from "app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { appActions } from "app/app.reducer";
import { ResponseType } from "common/types";
import { handleServerNetworkError } from "./handle-server-network-error";

/**

Executes a thunk function with error handling and status updates.
@template T - The type of the result returned by the logic function.
@param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | ResponseType>} thunkAPI - The base ThunkAPI object.
@param {() => Promise<T>} logic - The logic function to execute.
@returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - The result of the logic function or a rejected value.
**/

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | ResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    return await logic();
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
};
