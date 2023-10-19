import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { todolistsThunks } from "features/TodolistsList/Todolist/model/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/Todolist/Task/model/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectTasks } from "features/TodolistsList/Todolist/Task/model/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/Todolist/model/todolists.selectors";
import { useActions } from "hooks";

type Props = {
  demo?: boolean;
};

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // const { fetchTodolists,
  //   addTodolist: addTodolistThunk,
  //   removeTodolist: removeTodolistThunk,
  //   changeTodolistTitle: changeTodolistTitleThunk,
  //   changeTodolistFilter: changeTodolistFilterThunk } = useActions(todolistsThunks);

  // const {
  //   addTask: addTaskThunk,
  //   removeTask: removeTaskThunk,
  //   updateTask: updateTaskThunk } = useActions(tasksThunks)

  const { addTodolist: addTodolistThunk,
    fetchTodolists
  } = useActions({ ...todolistsThunks, ...tasksThunks })
  useEffect(() => {
    fetchTodolists()
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistThunk(title)
    }, []);

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
