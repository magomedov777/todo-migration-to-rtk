import { FilterValuesType } from "./todolists.reducer";
import { RequestStatusType } from "app/app.reducer";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TodoArgType = {
  id: string;
  title: string;
};

export type ChangeTodoFilterType = {
  id: string;
  filter: FilterValuesType;
};

export type ChangeTodolistEntityStatusType = {
  id: string;
  entityStatus: RequestStatusType;
};
