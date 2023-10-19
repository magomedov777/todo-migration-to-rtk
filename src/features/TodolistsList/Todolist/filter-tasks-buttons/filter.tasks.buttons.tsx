import Button from '@mui/material/Button/Button';
import { useActions } from 'hooks';
import React, { FC } from 'react';
import { FilterValuesType, TodolistDomainType, todolistsActions, todolistsThunks } from '../model/todolists.reducer';

type Props = {
    todolist: TodolistDomainType
}

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
    const { changeTodolistFilter } = useActions(todolistsThunks)
    const changeFilterHandler = (filter: FilterValuesType) => {
        changeTodolistFilter({ filter, id: todolist.id })
    }
    return (
        <>
            <Button
                variant={todolist.filter === "all" ? "outlined" : "text"}
                onClick={() => changeFilterHandler('all')}
                color={"inherit"}
            >
                All
            </Button>
            <Button
                variant={todolist.filter === "active" ? "outlined" : "text"}
                onClick={() => changeFilterHandler('active')}
                color={"primary"}
            >
                Active
            </Button>
            <Button
                variant={todolist.filter === "completed" ? "outlined" : "text"}
                onClick={() => changeFilterHandler('completed')}
                color={"secondary"}
            >
                Completed
            </Button>
        </>
    )
}