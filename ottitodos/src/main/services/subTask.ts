import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { CreateSubTask, subTasksTable } from '../../db/schemas'
import { ChangeStatusProps } from '../../preload/index.d'

export class SubTaskServices {
    async create(subTask_data: CreateSubTask): Promise<void> {
        try {
            await db.insert(subTasksTable).values(subTask_data)
        } catch (error) {
            throw new Error('Error creating subTask to database')
        }
    }
    async delete(subTaskId: string): Promise<void> {
        try {
            await db.delete(subTasksTable).where(eq(subTasksTable.id, subTaskId))
        } catch (error) {
            throw new Error('Error deleting subTask in database')
        }
    }
    async changeStatus({ subTaskId, status }: ChangeStatusProps): Promise<void> {
        try {
            await db.update(subTasksTable).set({ status }).where(eq(subTasksTable.id, subTaskId))
        } catch (error) {
            throw new Error('Error to update subTask status in database')
        }
    }
}
