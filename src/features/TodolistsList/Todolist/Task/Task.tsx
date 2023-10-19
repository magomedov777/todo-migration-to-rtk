import React, { ChangeEvent, FC, memo, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "utils/enums";
import { TaskType } from "./api/task.api.types";
import { useActions } from "hooks";
import { tasksThunks } from "./model/tasks.reducer";
import styles from './task.module.css';

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task: FC<Props> = memo(({ task, todolistId }) => {

  const { removeTask, updateTask } = useActions(tasksThunks)

  const removeTaskHandler = () => removeTask({ taskId: task.id, todolistId: todolistId })

  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: task.id, domainModel: { status }, todolistId: todolistId })
  }

  const changeTitleHandler = (title: string) => {
    updateTask({ taskId: task.id, domainModel: { title }, todolistId: todolistId });
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? styles.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeStatusHandler} />

      <EditableSpan value={task.title} onChange={changeTitleHandler} />
      <IconButton onClick={removeTaskHandler} >
        <Delete />
      </IconButton>
    </div>
  );
});
