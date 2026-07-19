import { CreateSubTask } from 'src/db/schemas'

export async function createSubTask(taskId: string) {
    const subTask: CreateSubTask = {
        title: 'Test subtask',
        taskId: taskId,
        description: '',
        status: false
    }
    try {
        await window.subTaskApi.createSubTask(subTask)
    } catch (error) {
        console.log('Cannot create new subtask', error)
    }
}
