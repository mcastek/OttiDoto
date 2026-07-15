import { useState } from 'react'
import { createTasksListDTO, TasksListState } from '../../formActions/tasks-list.actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const initialState: TasksListState = {
    success: false,
    errors: {},
    message: ''
}

export default function TasksListForm() {
    const [emblem, setEmblem] = useState<string>('')
    const [emblemColor, setEmblemColor] = useState<string>('#000000')
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            return createTasksListDTO(initialState, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks-lists'] })
        }
    })

    const handleSetEmblem = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmblem(e.target.value.charAt(0).toUpperCase())
    }

    const onCreateTaskList = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        mutation.mutate(formData)
    }

    const errors = mutation.data?.errors

    return (
        <form onSubmit={onCreateTaskList} style={{display: "flex", flexDirection: "column"}}>
            {emblem}
            <input name="emblem" type="hidden" value={emblem} />

            <input name="name" type="text" placeholder="Enter name" onChange={handleSetEmblem} />
            {errors?.name && <span style={{ color: 'red' }}>{errors.name[0]}</span>}
            <input
                name="color-emblem"
                type="color"
                value={emblemColor}
                onChange={(e) => setEmblemColor(e.target.value)}
            />
            <input name="from-date" type="date" />
            <input name="to-date" type="date" />
            {mutation.isError ? <div>An error occurred: {mutation.error.message}</div> : null}

            <button type="submit">Submit</button>
        </form>
    )
}
