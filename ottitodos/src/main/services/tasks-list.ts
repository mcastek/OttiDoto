import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { CreateTasksListDTO, TasksList, tasksListsTable } from '../../db/schemas/tasks-lists.table'

export class TasksListService {
    async getAll(): Promise<TasksList[]> {
        try {
            const tasks_lists = await db.select().from(tasksListsTable)
            return tasks_lists
        } catch (error) {
            console.error('Error fetching task lists:', error)
            throw error
        }
    }
    async add(list_data: CreateTasksListDTO): Promise<void> {
        console.log('Adding task list:', list_data)
        try {
            await db.insert(tasksListsTable).values(list_data)
            console.log('New user created!')
        } catch (error) {
            console.error('Error adding task list:', error)
            throw error
        }
    }
    async delete(id: string): Promise<void> {
        try {
            await db.delete(tasksListsTable).where(eq(tasksListsTable.id, id))
        } catch (error) {
            console.log('Error deleting task list:', error)
            throw error
        }
    }
}
