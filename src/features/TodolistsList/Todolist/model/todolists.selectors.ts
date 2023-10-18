import { AppRootStateType } from "app/store";

export const selectTodolists = (state: AppRootStateType) => state.todolists;
