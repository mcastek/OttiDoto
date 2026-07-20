import { CreateSubTask } from '../../db/schemas'
import { SubTaskServices } from '../services/subTask'
import { handleIpc } from '../utils/ipc-wrapper'
import { ChangeStatusProps } from '../../preload/index.d'

const newSubTaskService = new SubTaskServices()

export function registerSubTaskHandlers() {
    handleIpc('create-subTask', async (_event, subTask_data: CreateSubTask) => {
        return await newSubTaskService.create(subTask_data)
    })
    handleIpc('delete-subTask', async (_event, subTaskid: string) => {
        return await newSubTaskService.delete(subTaskid)
    })
    handleIpc('change-status', async (_event, { subTaskId, status }: ChangeStatusProps) => {
        return await newSubTaskService.changeStatus({ subTaskId, status })
    })
}
