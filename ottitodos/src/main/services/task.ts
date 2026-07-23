import { and, desc, eq } from 'drizzle-orm'
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
            const lastTask = await db
                .select({ position: tasksTable.position })
                .from(tasksTable)
                .where(
                    and(
                        eq(tasksTable.columnId, task_data.columnId),
                        eq(tasksTable.listId, task_data.listId)
                    )
                )
                .orderBy(desc(tasksTable.position))
                .limit(1)

            const newPosition = lastTask.length > 0 ? lastTask[0].position + 10000 : 10000

            await db.insert(tasksTable).values({ ...task_data, position: newPosition })
            console.log('Created new task!\n', { ...task_data, position: newPosition })
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
    async reorderTask(taskId: string, position: number): Promise<void> {
        try {
            console.log('Reordering...')
            await db.update(tasksTable).set({ position }).where(eq(tasksTable.id, taskId))
        } catch (error) {
            console.log('Error roeordering task', error)
            throw error
        }
    }
    async moveTask(taskId: string, columnId: string, newPosition: number): Promise<void> {
        try {
            console.log('ping')
            await db
                .update(tasksTable)
                .set({ columnId, position: newPosition })
                .where(eq(tasksTable.id, taskId))
        } catch (error) {
            console.log('Error while moving task to another column:', error)
            throw error
        }
    }
}
