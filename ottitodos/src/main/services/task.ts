import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { CreateTaskDTO, Task, tasksTable } from '../../db/schemas'

export class TaskServices {
    async getAllbyList(listId: string): Promise<Task[]> {
        try {
            const tasks = await db.select().from(tasksTable).where(eq(tasksTable.listId, listId))
            return tasks
        } catch (error) {
            console.log('Error fetching task:', error)
            throw error
        }
    }
    async create(task_data: CreateTaskDTO): Promise<void> {
        try {
            await db.insert(tasksTable).values(task_data)
            console.log('Created new task!\n', task_data)
        } catch (error) {
            console.log('Error creating task:', error)
            throw error
        }
    }
    async delete(id: string): Promise<void> {
        try {
            await db.delete(tasksTable).where(eq(tasksTable.id, id))
        } catch (error) {
            console.log('Error deleting task', error)
            throw error
        }
    }
    async moveTask(taskId: string, columnId: string): Promise<void> {
        try {
            await db.update(tasksTable).set({ columnId }).where(eq(tasksTable.id, taskId))
        } catch (error) {
            console.log('Error while moving task to another column:', error)
            throw error
        }
    }
}
