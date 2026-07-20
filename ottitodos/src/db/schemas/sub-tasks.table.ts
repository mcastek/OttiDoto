import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { tasksTable } from './tasks.table'
import { createInsertSchema } from 'drizzle-orm/zod'
import z from 'zod'

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

export const subTaskSchema = createInsertSchema(subTasksTable, {
    id: z.uuid(),
    title: z
        .string()
        .min(1, 'Name of subTask not be empty')
        .max(60, 'SubTask cannot be longer than 60 characters'),
    description: z
        .string()
        .max(500, 'Description of subTask cannot be longer than 500 characters')
        .nullable()
})
export const SubTaskCardSchema = subTaskSchema.extend({ id: z.uuid().nullable() })
export const CreateSubTaskSchema = subTaskSchema.omit({ id: true })
export const CreateSubTaskInputSchema = subTaskSchema.omit({ id: true, taskId: true, status: true })

export type SubTask = z.infer<typeof subTaskSchema>
export type SubTaskCardProps = z.infer<typeof SubTaskCardSchema>
export type CreateSubTask = z.infer<typeof CreateSubTaskSchema>
export type CreateSubTaskInput = z.infer<typeof CreateSubTaskInputSchema>
