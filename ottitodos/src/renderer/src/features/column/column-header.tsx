import Input from '@renderer/components/input/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { Activity, useCallback, useRef, useState } from 'react'
import { listBoardData, TasksColumn } from 'src/db/schemas'
import { ColumnFormState, ColumnPayload, createColumn } from '../../../formActions/column.actions'
import { useOnClickOutside } from '@renderer/hooks/useOnClickOutside'

const initialState: ColumnFormState = {
    success: false,
    errors: {},
    message: ''
}

type ColumnHeaderProps = {
    column_data: TasksColumn
    onEdited?: (event: boolean) => void
}

export const ColumnHeader = ({ column_data, onEdited }: ColumnHeaderProps) => {
    const [editName, setEditName] = useState<boolean>(column_data.name === '')
    const [name, setName] = useState<string>(column_data.name || '')
    const formRef = useRef<HTMLFormElement>(null)
    const queryClient = useQueryClient()

    const handleCancel = useCallback(() => {
        if (!column_data.id && name === '') {
            queryClient.setQueryData(['board', column_data.listId], (oldBoard: listBoardData) => ({
                ...oldBoard,
                columns: oldBoard.columns.filter((c: TasksColumn) => c.id !== column_data.id)
            }))
        }
        setEditName(false)
        onEdited?.(false)
    }, [column_data.id, column_data.listId, queryClient, onEdited])

    useOnClickOutside(formRef, handleCancel)

    const mutation = useMutation({
        mutationFn: async ({
            formData,
            payload
        }: {
            formData: FormData
            payload: ColumnPayload
        }) => {
            column_data.id
                ? console.log('test')
                : await createColumn(initialState, formData, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', column_data.listId] })
            setEditName(false)
            onEdited?.(false)
        }
    })

    const onFormAction = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newFormDate = new FormData(e.currentTarget)

        const payload: ColumnPayload = {
            listId: column_data.listId,
            editable: column_data.editable,
            position: column_data.position
        }
        mutation.mutate({ formData: newFormDate, payload })
    }

    return (
        <form
            ref={formRef}
            onClick={(e) => e.stopPropagation()}
            onSubmit={onFormAction}
            style={{ display: 'inline-flex' }}
        >
            {editName ? (
                <>
                    <Input
                        name="column_name"
                        placeholder="Add column name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={handleCancel}
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
