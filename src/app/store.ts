import { tasksReducer } from "features/TodolistsList/tasks.reducer";
import { todolistsReducer } from "features/TodolistsList/todolists.reducer";
import { AnyAction, combineReducers } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { appReducer } from "app/app.reducer";
import { authReducer } from "features/auth/auth.reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

// @ts-ignore
window.store = store;
