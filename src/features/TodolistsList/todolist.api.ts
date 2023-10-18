import { instance } from "api/common.api";
import { UpdateDomainTaskModelType } from "./tasks.reducer";
import { FilterValuesType } from "./todolists.reducer";
import { RequestStatusType } from "app/app.reducer";
import { TaskPriorities, TaskStatuses } from "utils";
import { ResponseType } from "common/types";

export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>("todo-lists");
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
    return promise;
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
    return promise;
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<ResponseType>(`todo-lists/${id}`, { title: title });
    return promise;
  },
};

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
