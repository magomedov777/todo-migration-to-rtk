import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FilterValuesType,
  todolistsThunks,
} from "features/TodolistsList/Todolist/model/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/Todolist/Task/model/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectTasks } from "features/TodolistsList/Todolist/Task/model/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/Todolist/model/todolists.selectors";
import { TaskStatuses } from "utils/enums";
import { useActions } from "hooks";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
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

  const {
    addTask: addTaskThunk,
    addTodolist: addTodolistThunk,
    changeTodolistTitle: changeTodolistTitleThunk,
    changeTodolistFilter: changeTodolistFilterThunk,
    fetchTasks,
    fetchTodolists,
    removeTodolist: removeTodolistThunk,
    updateTask: updateTaskThunk
  } = useActions({ ...todolistsThunks, ...tasksThunks })

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolists();

  }, []);



  const addTask = useCallback(function (title: string, todolistId: string) {
    addTaskThunk({ title, todolistId })
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    updateTaskThunk({ taskId, todolistId, domainModel: { status } })
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    updateTaskThunk({ taskId, todolistId, domainModel: { title } })
  }, [])

  const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
    changeTodolistFilterThunk({ filter, id })
  }, []);

  const removeTodolist = useCallback(function (todolistId: string) {
    removeTodolistThunk(todolistId)
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTodolistTitleThunk({ id, title })
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistThunk(title)
    },
    []
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
