import React, { FC } from 'react';
import { TaskType } from './Todolist/Task/api/task.api.types';
import { TodolistDomainType } from './Todolist/model/todolists.reducer';
import { TaskStatuses } from 'utils';
import { Task } from './Todolist/Task/task';

type Props = {
    todolist: TodolistDomainType
    tasks: TaskType[]
}

export const Tasks: FC<Props> = ({ todolist, tasks }) => {

    let tasksForTodolist = tasks;

    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }
    return (
        <>
            {tasksForTodolist.map((t) => (
                <Task
                    key={t.id}
                    task={t}
                    todolistId={todolist.id}
                />
            ))}
        </>
    )
}