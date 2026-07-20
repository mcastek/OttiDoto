import { CreateTaskDTO } from '../../db/schemas'
import { TaskServices } from '../services/task'
import { handleIpc } from '../utils/ipc-wrapper'

const taskService = new TaskServices()

export function registerTaskHandlers() {
    handleIpc('get-all-tasks-by-list', async (_event, listId: string) => {
        return await taskService.getAllbyList(listId)
    })
    handleIpc('create-task', async (_event, task_data: CreateTaskDTO) => {
        return await taskService.create(task_data)
    })
    handleIpc('delete-task', async (_event, id: string) => {
        return await taskService.delete(id)
    })
    handleIpc('move-task', async (_event, taskId: string, columnId: string) => {
        return await taskService.moveTask(taskId, columnId)
    })
}
