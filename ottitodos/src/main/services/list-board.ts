import { eq } from 'drizzle-orm'
import { db } from '../../db'
import {
    listBoardData,
    subTasksTable,
    tasksColumnsTable,
    tasksTable,
    TaskWithSubTasks
} from '../../db/schemas'

export async function getListBoard(listId: string): Promise<listBoardData> {
    try {
        const rawTasksData = await db
            .select()
            .from(tasksTable)
            .where(eq(tasksTable.listId, listId))
            .leftJoin(subTasksTable, eq(tasksTable.id, subTasksTable.taskId))

        const grouped = rawTasksData.reduce(
            (acc, row) => {
                const taskId = row.tasks_table.id

                if (!acc[taskId]) {
                    acc[taskId] = {
                        tasks: row.tasks_table,
                        subTasks: []
                    }
                }

                if (row.sub_tasks_table) {
                    acc[taskId].subTasks.push(row.sub_tasks_table)
                }

                return acc
            },
            {} as Record<string, TaskWithSubTasks>
        )

        const taskWithSubTasks = Object.values(grouped)

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
