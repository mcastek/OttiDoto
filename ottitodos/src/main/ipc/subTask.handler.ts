import { CreateSubTask } from '../../db/schemas'
import { SubTaskServices } from '../services/subTask'
import { handleIpc } from '../utils/ipc-wrapper'

const newSubTaskService = new SubTaskServices()

export function registerSubTaskHandlers() {
    handleIpc('create-subTask', async (_event, subTask_data: CreateSubTask) => {
        return await newSubTaskService.create(subTask_data)
    })
}
