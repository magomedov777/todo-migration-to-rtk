import { ResponseType } from "../common/types";
import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";

/**
Handles server application errors and dispatches actions accordingly.
@template D - The type of data returned from the server
@param {ResponseType<D>} data - The response data from the server
@param {Dispatch} dispatch - The Redux dispatch function
@param {boolean} [showError=true] - Indicates whether to show the error message or not
@returns {void}
**/

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
};
