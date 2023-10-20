import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/TodolistsList/Todolist/model/todolists.reducer";
import { tasksThunks } from "./Task/model/tasks.reducer";
import { TaskType } from "./Task/api/task.api.types";
import { useActions } from "hooks";
import { FilterTasksButtons } from "./filter-tasks-buttons/filter.tasks.buttons";
import { Tasks } from "../tasks";
import { TodolistTitle } from "./todolist-title";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
};

export const Todolist: FC<Props> = memo(({ todolist, tasks }) => {
  const { fetchTasks, addTask } = useActions(tasksThunks)
  useEffect(() => {
    fetchTasks(todolist.id)
  }, []);

  const addTaskHandler =
    (title: string) => {
      return addTask({ title, todolistId: todolist.id }).unwrap()
    }
  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} tasks={tasks} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  );
});
