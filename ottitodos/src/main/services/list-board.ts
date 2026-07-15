import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { listBoardData, tasksColumnsTable, tasksTable } from '../../db/schemas'

export async function getListBoard(listId: string): Promise<listBoardData> {
    try {
        const tasks = await db.select().from(tasksTable).where(eq(tasksTable.listId, listId))
        const columns = await db
            .select()
            .from(tasksColumnsTable)
            .where(eq(tasksColumnsTable.listId, listId))

        return { tasks, columns }
    } catch (error) {
        console.log('Error fatching list board:', error)
        throw error
    }
}
