import React, { memo, useCallback, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { FilterValuesType, TodolistDomainType, todolistsThunks } from "features/TodolistsList/Todolist/model/todolists.reducer";
import { useAppDispatch } from "hooks/useAppDispatch";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "./Task/model/tasks.reducer";
import { TaskStatuses } from "utils/enums";
import { TaskType } from "./Task/api/task.api.types";
import { useActions } from "hooks";
import { Task } from "./Task/task";
import { FilterTasksButtons } from "./filter-tasks-buttons/filter.tasks.buttons";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;

  demo?: boolean;
};


export const Todolist = memo(function ({ demo = false, ...props }: PropsType) {
  const { fetchTasks, addTask } = useActions(tasksThunks)
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  useEffect(() => {
    fetchTasks(props.todolist.id)
  }, []);

  const addTaskHandler =
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id });
    }

  const removeTodolistHandler = () => {
    removeTodolist(props.todolist.id);
  };

  const changeTodolistTitleHandler =
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title });
    }


  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={props.todolist} />
      </div>
    </div>
  );
});
