import { AppRootStateType } from "app/store";

export const selectTasks = (state: AppRootStateType) => state.tasks;
