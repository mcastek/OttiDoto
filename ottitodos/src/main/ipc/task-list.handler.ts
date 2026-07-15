import { CreateTasksListDTO } from '../../db/schemas'
import { getListBoard } from '../services/list-board'
import { TasksListService } from '../services/tasks-list'
import { handleIpc } from '../utils/ipc-wrapper'

const tasksListService = new TasksListService()

export function registerTaskListHandlers() {
    handleIpc('get-all-task-lists', async () => {
        return await tasksListService.getAll()
    })
    handleIpc('get-list-board', async (_event, listId: string) => {
        return await getListBoard(listId)
    })
    handleIpc('add-task-list', async (_event, list_data: CreateTasksListDTO) => {
        return await tasksListService.add(list_data)
    })
    handleIpc('delete-task-list', async (_event, id) => {
        return await tasksListService.delete(id)
    })
}
