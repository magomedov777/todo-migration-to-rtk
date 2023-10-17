import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";

/**
 * Handles server network error by dispatching appropriate actions.
 *
 * @param {object} error - The server network error object.
 * @param {string} error.message - The error message.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @returns {void}
 */

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(appActions.setAppError({ error: error.message ? error.message : "Some error occurred" }));
};
