import { CreateSubTask, listBoardData, SubTask } from 'src/db/schemas'
import SubTaskCard from './sub-task'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubTask } from '../../../formActions/subtask.actions'
import { Activity, useState } from 'react'

export default function SubTaskList({
    listId,
    taskId,
    subtask_data
}: {
    listId: string
    taskId: string
    subtask_data: SubTask[]
}) {
    const [openList, setOpenList] = useState<boolean>(false)

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => await createSubTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    const handleAddNewSubTask = () => {
        const newSubTaska: CreateSubTask = {
            title: '',
            description: null,
            taskId: taskId,
            status: false
        }

        queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => {
            if (!oldBoard) return oldBoard
            console.log('ping')
            return {
                ...oldBoard,
                taskWithSubTasks: oldBoard.taskWithSubTasks.map((item) => {
                    if (item.tasks.id === taskId) {
                        return {
                            ...item,
                            subTasks: [...item.subTasks, newSubTaska]
                        }
                    }
                    console.log(item)
                    return item
                })
            }
        })

        setOpenList(true)
    }
    const subtaskCount = subtask_data.length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '2em' }}>
            <Activity mode={openList && subtaskCount > 0 ? 'visible' : 'hidden'}>
                {subtask_data.map((subtask) => (
                    <SubTaskCard subTask_data={subtask} />
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
                        handleAddNewSubTask()
                    }}
                >
                    ➕
                </button>
            </div>
        </div>
    )
}
