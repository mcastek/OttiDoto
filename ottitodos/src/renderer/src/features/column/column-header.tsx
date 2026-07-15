import Input from '@renderer/components/input/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { Activity, useEffect, useRef, useState } from 'react'
import { listBoardData, TasksColumn } from 'src/db/schemas'
import { ColumnFormState, createColumn } from '../../../formActions/column.actions'

const initialState: ColumnFormState = {
    success: false,
    errors: {},
    message: ''
}

type ColumnHeaderProps = {
    listId: string
    column_data: TasksColumn
    onEdited?: (event: boolean) => void
}

export const ColumnHeader = ({ listId, column_data, onEdited }: ColumnHeaderProps) => {
    const [editName, setEditName] = useState<boolean>(column_data.name === '')
    const [name, setName] = useState<string>(column_data.name || '')
    const formRef = useRef<HTMLFormElement>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!editName) return

        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                handleCancel()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [editName])

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            column_data?.id ? console.log('test') : await createColumn(initialState, formData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
            setEditName(false)
            onEdited?.(false)
        }
    })

    const onFormAction = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newFormDate = new FormData(e.currentTarget)
        mutation.mutate(newFormDate)
    }

    const handleCancel = () => {
        if (!column_data.id) {
            queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => ({
                ...oldBoard,
                columns: oldBoard.columns.filter((c: TasksColumn) => c.id !== column_data.id)
            }))
        }
        setEditName(false)
        onEdited?.(false)
    }

    return (
        <form ref={formRef} onSubmit={onFormAction} style={{ display: 'inline-flex' }}>
            {editName ? (
                <>
                    <input name="column_id" type="hidden" value={column_data?.id} />
                    <input name="position" type="hidden" value={column_data.position} />
                    <input name="list_id" type="hidden" value={column_data.listId} />
                    <Input
                        name="column_name"
                        placeholder="Add column name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setEditName(false)
                            onEdited?.(false)
                        }}
                    >
                        ❌
                    </button>
                    <button type="submit">✔️</button>
                </>
            ) : (
                <>
                    <p>{name}</p>
                    <Activity mode={column_data.editable ? 'visible' : 'hidden'}>
                        <button
                            type="button"
                            onClick={() => {
                                setEditName(true)
                                onEdited ? onEdited(true) : null
                            }}
                        >
                            ✏️
                        </button>
                    </Activity>
                </>
            )}
        </form>
    )
}
