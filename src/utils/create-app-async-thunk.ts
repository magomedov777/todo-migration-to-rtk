import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";
import { ResponseType } from "common/types";

/**

Creates an async thunk for the app.
@template AppRootStateType - The type of the app's root state.
@template AppDispatch - The type of the app's dispatch function.
@template RejectValueType - The type of the reject value.
@returns {AsyncThunk<ResponseType, void, { state: AppRootStateType; dispatch: AppDispatch; rejectValue: null | RejectValueType; }>}
*/

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | RejectValueType;
}>();

export type RejectValueType = {
  data: ResponseType;
  showGlobalError: boolean;
};
