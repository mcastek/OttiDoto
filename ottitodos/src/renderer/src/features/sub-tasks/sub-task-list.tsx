import { SubTask } from 'src/db/schemas'
import SubTaskCard from './sub-task'
import { useQueryClient } from '@tanstack/react-query'
import { Activity, useState } from 'react'
import { useListId } from '@renderer/hooks/useListId'
import { handleAddSubTask } from './sub-task.utils'

export default function SubTaskList({
    taskId,
    subtask_data
}: {
    taskId: string
    subtask_data: SubTask[]
}) {
    const [openList, setOpenList] = useState<boolean>(false)

    const listId = useListId()
    const queryClient = useQueryClient()

    const subtaskCount = subtask_data.length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '2em' }}>
            <Activity mode={openList && subtaskCount > 0 ? 'visible' : 'hidden'}>
                {subtask_data.map((subtask) => (
                    <SubTaskCard key={subtask.id} subTask_data={subtask} />
                ))}
            </Activity>
            <div
                style={{
                    backgroundColor: '#1F2736',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '.5em'
                }}
                onClick={() => {
                    setOpenList((prev) => !prev)
                }}
            >
                <p>SubTasks ({subtaskCount})</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleAddSubTask(queryClient, listId, taskId, setOpenList)
                    }}
                >
                    ➕
                </button>
            </div>
        </div>
    )
}
