import { QueryClient } from '@tanstack/react-query'
import { CreateSubTask, listBoardData, SubTask } from '../../../../db/schemas'

const handleAddSubTask = (
    queryClient: QueryClient,
    listId: string,
    taskId: string,
    handler: (event: boolean) => void
) => {
    const newSubTaska: CreateSubTask = {
        title: '',
        description: null,
        taskId: taskId,
        status: false
    }

    queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => {
        if (!oldBoard) return oldBoard
        return {
            ...oldBoard,
            taskWithSubTasks: oldBoard.taskWithSubTasks.map((item) => {
                if (item.tasks.id === taskId) {
                    return {
                        ...item,
                        subTasks: [...item.subTasks, newSubTaska]
                    }
                }
                return item
            })
        }
    })

    handler(true)
}

const handleCancel = (
    queryClient: QueryClient,
    subTaskData: SubTask,
    listId: string,
    handler: (value: boolean) => void
) => {
    if (!subTaskData.id && subTaskData.title === '') {
        queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => ({
            ...oldBoard,
            taskWithSubTasks: oldBoard.taskWithSubTasks.map((item) => ({
                ...item,
                subTasks: item.subTasks.filter((subTask) => subTask.id !== subTaskData.id)
            }))
        }))
    }
    handler(false)
}

export { handleCancel, handleAddSubTask }
