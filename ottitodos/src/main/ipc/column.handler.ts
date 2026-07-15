import { CreateTasksColumn } from '../../db/schemas'
import { ColumnServices } from '../services/column'
import { handleIpc } from '../utils/ipc-wrapper'

const columnService = new ColumnServices()

export function registerColumnHandlers() {
    handleIpc('create-column', async (_event, column_data: CreateTasksColumn) => {
        return await columnService.create(column_data)
    })
    handleIpc('delete-column', async (_event, id: string) => {
        return await columnService.delete(id)
    })
}
