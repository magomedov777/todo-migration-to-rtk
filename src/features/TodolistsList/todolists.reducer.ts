import {
  ChangeTodoFilterType,
  ChangeTodolistEntityStatusType,
  TodoArgType,
  todolistsAPI,
  TodolistType,
} from "api/todolists-api";
import { appActions, RequestStatusType } from "app/app.reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
        const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
        state.unshift(newTodolist);
      })
      .addCase(todolistsThunks.changeTodolistTitle.fulfilled, (state, action: PayloadAction<{ arg: TodoArgType }>) => {
        const todo = state.find((todo) => todo.id === action.payload.arg.id);
        if (todo) {
          todo.title = action.payload.arg.title;
        }
      })
      .addCase(
        todolistsThunks.changeTodolistFilter.fulfilled,
        (state, action: PayloadAction<{ arg: ChangeTodoFilterType }>) => {
          const todo = state.find((todo) => todo.id === action.payload.arg.id);
          if (todo) {
            todo.filter = action.payload.arg.filter;
          }
        }
      )
      .addCase(
        todolistsThunks.changeTodolistEntityStatus.fulfilled,
        (state, action: PayloadAction<{ arg: ChangeTodolistEntityStatusType }>) => {
          const todo = state.find((todo) => todo.id === action.payload.arg.id);
          if (todo) {
            todo.entityStatus = action.payload.arg.entityStatus;
          }
        }
      );
  },
});

//fetch todo for rewrite on RTK today
// const fetchTodolistsTC = (): AppThunk => {
//   return (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     todolistsAPI
//       .getTodolists()
//       .then((res) => {
//         dispatch(todolistsActions.setTodolists({ todolists: res.data }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todo/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const removeTodolist = createAppAsyncThunk<{ id: string }, string>("todolists/removeTodolist", async (id, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsThunks.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
    const res = await todolistsAPI.deleteTodolist(id);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const addTodolist = createAppAsyncThunk<any, any>("todolists/addTodolist", async (title: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { todolist: res.data.data.item };
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const changeTodolistTitle = createAppAsyncThunk("todolists/changeTodolistTitle", async (arg: TodoArgType, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
    return { arg };
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const changeTodolistFilter = createAppAsyncThunk(
  "todolists/changeTodolistFilter",
  async (arg: ChangeTodoFilterType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistsAPI.updateTodolist(arg.id, arg.filter);
      return { arg };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const changeTodolistEntityStatus = createAppAsyncThunk(
  "todolists/changeTodolistEntityStatus",
  async (arg: ChangeTodolistEntityStatusType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistsAPI.updateTodolist(arg.id, arg.entityStatus);
      return { arg };
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  changeTodolistFilter,
  changeTodolistEntityStatus,
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
