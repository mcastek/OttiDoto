import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { tasksTable } from './tasks.table'


export const subTasksTable = sqliteTable('sub_tasks_table', {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    taskId: text('task_id')
        .references(() => tasksTable.id)
        .notNull(),
    title: text({ length: 100 }).notNull(),
    description: text({ length: 300 }),
    status: integer({ mode: 'boolean' }).notNull()
})