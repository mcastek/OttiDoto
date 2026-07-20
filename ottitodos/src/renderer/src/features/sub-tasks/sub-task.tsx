import { useRef, useState } from 'react'
import type { SubTask } from '../../../../db/schemas'
import {
    createSubTask,
    SubTaskFormState,
    subTaskPayload
} from '../../../formActions/subtask.actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useListId } from '@renderer/hooks/useListId'
import { useOnClickOutside } from '@renderer/hooks/useOnClickOutside'
import { handleCancel } from './sub-task.utils'
import { CheckBox } from './sub-task-checkbox'

const initialState: SubTaskFormState = {
    success: false,
    errors: {},
    message: ''
}

export default function SubTaskCard({ subTask_data }: { subTask_data: SubTask }) {
    const [editSubTask, setEditSubTask] = useState<boolean>(subTask_data.title === '')
    const FormRef = useRef<HTMLFormElement>(null)
    const listId = useListId()
    const queryClient = useQueryClient()
    useOnClickOutside(FormRef, () =>
        handleCancel(queryClient, subTask_data, listId, setEditSubTask)
    )

    const mutation = useMutation({
        mutationFn: async ({
            formData,
            payload
        }: {
            formData: FormData
            payload: subTaskPayload
        }) => await createSubTask(initialState, formData, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
            setEditSubTask(false)
        }
    })

    const onHandleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newPayload: subTaskPayload = { ...subTask_data }
        const newFormData = new FormData(e.currentTarget)
        mutation.mutate({ formData: newFormData, payload: newPayload })
    }

    return (
        <form
            ref={FormRef}
            onSubmit={onHandleSubmit}
            style={{
                backgroundColor: '#1F2736',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '.5em'
            }}
        >
            {editSubTask ? (
                <>
                    <input type="hidden" name="task_id" />
                    <input type="text" name="title" placeholder="Add subtask" />
                    <button
                        type="button"
                        onClick={() =>
                            handleCancel(queryClient, subTask_data, listId, setEditSubTask)
                        }
                    >
                        ❌
                    </button>
                    <button type="submit">✔️</button>
                </>
            ) : (
                <div style={{ display: 'flex' }}>
                    <CheckBox subTaskId={subTask_data.id} status={subTask_data.status} />
                    <p>{subTask_data.title}</p>
                </div>
            )}
        </form>
    )
}
