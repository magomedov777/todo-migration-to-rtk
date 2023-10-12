import { ResponseType } from "api/common.api";
import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";

/**
 * Handles server application error by dispatching appropriate actions.
 *
 * @template D - The type of the data received from the server response.
 * @param {ResponseType<D>} data - The server response containing data and error messages.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @returns {void}
 */

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
