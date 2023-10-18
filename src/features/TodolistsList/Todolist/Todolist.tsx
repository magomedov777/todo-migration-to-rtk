import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/Todolist/model/todolists.reducer";
import { useAppDispatch } from "hooks/useAppDispatch";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "./Task/model/tasks.reducer";
import { TaskStatuses } from "utils/enums";
import { TaskType } from "./Task/api/task.api.types";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    dispatch(tasksThunks.fetchTasks(props.todolist.id));
  }, []);

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.todolist.id);
    },
    [props.addTask, props.todolist.id]
  );

  const removeTodolist = () => {
    props.removeTodolist(props.todolist.id);
  };

  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.todolist.id, title);
    },
    [props.todolist.id, props.changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(
    () => props.changeFilter("all", props.todolist.id),
    [props.todolist.id, props.changeFilter]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeFilter("active", props.todolist.id),
    [props.todolist.id, props.changeFilter]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter("completed", props.todolist.id),
    [props.todolist.id, props.changeFilter]
  );

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
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"} />
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
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
