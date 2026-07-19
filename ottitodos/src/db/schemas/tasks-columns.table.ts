import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { tasksListsTable } from './tasks-lists.table'
import { createInsertSchema } from 'drizzle-orm/zod'
import z from 'zod'

export const tasksColumnsTable = sqliteTable('tasks_column_table', {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    listId: text('list_id')
        .references(() => tasksListsTable.id)
        .notNull(),
    name: text({ length: 100 }).notNull(),
    editable: integer({ mode: 'boolean' }).notNull(),
    position: integer().notNull()
})

export const TasksColumnSchema = createInsertSchema(tasksColumnsTable, {
    id: z.uuid().nullable,
    name: z
        .string()
        .min(1, { message: 'Nazwa listy nie może być pusta' })
        .max(60, { message: 'Nazwa listy nie może być dłuższa niż 60 znaków' }),
    listId: z.string().optional(),
    position: z.number()
})

export const CreateTasksColumnSchema = TasksColumnSchema.extend({ listId: z.string() }).omit({
    id: true
})
export const CreateTasksColumnInputSchema = TasksColumnSchema.omit({
    editable: true,
    id: true
}).extend({ listId: z.string() })

export type TasksColumn = z.infer<typeof TasksColumnSchema>
export type CreateTasksColumn = z.infer<typeof CreateTasksColumnSchema>
export type CreateTasksColumnInput = z.infer<typeof CreateTasksColumnInputSchema>
