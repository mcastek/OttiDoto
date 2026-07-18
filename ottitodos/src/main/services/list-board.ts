import { eq, inArray } from 'drizzle-orm'
import { db } from '../../db'
import { listBoardData, subTasksTable, tasksColumnsTable, tasksTable } from '../../db/schemas'

export async function getListBoard(listId: string): Promise<listBoardData> {
    try {
        const rawTasksData = await db
            .select()
            .from(tasksTable)
            .where(eq(tasksTable.listId, listId))
            .leftJoin(subTasksTable, eq(tasksTable.id, subTasksTable.taskId))

        const taskWithSubTasks = rawTasksData.map((row) => ({
            tasks: row.tasks_table,
            subTasks: row.sub_tasks_table
        }))

        const columns = await db
            .select()
            .from(tasksColumnsTable)
            .where(eq(tasksColumnsTable.listId, listId))

        return { taskWithSubTasks, columns }
    } catch (error) {
        console.log('Error fatching list board:', error)
        throw error
    }
}
