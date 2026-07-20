import { useRef, useState } from 'react'
import type { SubTask } from '../../../../db/schemas'
import { useQueryClient } from '@tanstack/react-query'
import { useListId } from '@renderer/hooks/useListId'
import { useOnClickOutside } from '@renderer/hooks/useOnClickOutside'
import { handleCancel } from './sub-task.utils'
import useSubTaskActions from './hooks/useSubTaskActions'

export default function SubTaskCard({ subTask_data }: { subTask_data: SubTask }) {
    const [editSubTask, setEditSubTask] = useState<boolean>(subTask_data.title === '')
    const FormRef = useRef<HTMLFormElement>(null)
    const listId = useListId()
    const queryClient = useQueryClient()
    const { createSubTask, deleteSubTask, changeStatus } = useSubTaskActions(listId)
    useOnClickOutside(FormRef, () =>
        handleCancel(queryClient, subTask_data, listId, setEditSubTask)
    )

    const onHandleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newFormData = new FormData(e.currentTarget)
        createSubTask({ formData: newFormData, payload: { ...subTask_data } })
        setEditSubTask(false)
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
                <>
                    <div style={{ display: 'flex' }}>
                        <input
                            name="status"
                            type="checkbox"
                            checked={subTask_data.status}
                            onChange={() => {
                                changeStatus({
                                    subTaskId: subTask_data.id,
                                    status: !subTask_data.status
                                })
                            }}
                        />
                        <p>{subTask_data.title}</p>
                    </div>
                    <button onClick={() => deleteSubTask(subTask_data.id)}>🗑️</button>
                </>
            )}
        </form>
    )
}
