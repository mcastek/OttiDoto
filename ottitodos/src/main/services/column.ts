import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { CreateTasksColumn, tasksColumnsTable } from '../../db/schemas'

export class ColumnServices {
    async create(column_data: CreateTasksColumn): Promise<void> {
        try {
            console.log('Creating', column_data)
            await db.insert(tasksColumnsTable).values(column_data)
            console.log('Created', column_data)
        } catch (error) {
            console.log('Error creating new column:', error)
            throw error
        }
    }
    async delete(id: string): Promise<void> {
        try {
            await db.delete(tasksColumnsTable).where(eq(tasksColumnsTable.id, id))
        } catch (error) {
            console.log('Error deleting column', error)
            throw error
        }
    }
}
