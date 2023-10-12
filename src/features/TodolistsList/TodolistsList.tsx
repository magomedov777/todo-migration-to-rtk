import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FilterValuesType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectTasks } from "features/TodolistsList/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/todolists.selectors";
import { TaskStatuses } from "utils/enums";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    const thunk = todolistsThunks.fetchTodolists();
    dispatch(thunk);
  }, []);

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    dispatch(tasksThunks.removeTask({ taskId, todolistId }));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ title, todolistId }));
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId, todolistId, domainModel: { status } }));
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId, todolistId, domainModel: { title } }))
  }, [])

  const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
    dispatch(todolistsThunks.changeTodolistFilter({ filter, id }));
  }, []);

  const removeTodolist = useCallback(function (todolistId: string) {
    dispatch(todolistsThunks.removeTodolist(todolistId));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistsThunks.changeTodolistTitle({ id, title }));
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
