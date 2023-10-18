import { appActions } from "app/app.reducer";
import { todolistsThunks } from "features/TodolistsList/todolists.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { handleServerAppError } from "utils/handle-server-app-error";
import { ResultCode, TaskPriorities, TaskStatuses } from "utils/enums";
import { todolistsAPI } from "./todolist.api";
import { thunkTryCatch } from "utils/thunk-try-catch";
import { AddTaskArgType, taskAPI, TaskType, UpdateTaskArgType, UpdateTaskModelType } from "./Todolist/task.api";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })

      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      });
  },
});

const removeTask = createAppAsyncThunk<any, any>("tasks/removeTask", async (arg: ArgType, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const { taskId, todolistId } = arg;
    const res = await taskAPI.deleteTask(todolistId, taskId);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(tasksActions.removeTask({ taskId, todolistId }));
      return { arg };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await taskAPI.getTasks(todolistId);
      const tasks = res.data.items;
      return { tasks, todolistId };
    });
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>("tasks/addTask", async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  return thunkTryCatch(thunkApi, async () => {
    const res = await taskAPI.createTask(arg);
    if (res.data.resultCode === ResultCode.success) {
      const task = res.data.data.item;
      return { task };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        console.warn("task not found in the state");
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };
      const res = await taskAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.success) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  }
);

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask };

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export type ArgType = {
  todolistId: string;
  taskId: string;
};
