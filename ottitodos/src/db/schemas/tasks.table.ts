import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { taskBadgesTable } from './task-badges.table'
import { tasksListsTable } from './tasks-lists.table'
import { createInsertSchema } from 'drizzle-orm/zod'
import z, { uuid } from 'zod'
import { InferSelectModel } from 'drizzle-orm'

export const tasksTable = sqliteTable('tasks_table', {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    listId: text('list_id')
        .references(() => tasksListsTable.id)
        .notNull(),
    columnId: text('column_id').notNull(),
    badgeId: text('badge_id').references(() => taskBadgesTable.id),
    title: text({ length: 100 }).notNull(),
    description: text({ length: 500 })
})

export const TaskSchema = createInsertSchema(tasksTable, {
    title: z
        .string()
        .min(1, { message: 'Nazwa zadania nie może być pusta' })
        .max(100, { message: 'Nazwa zadania nie może być dłuższa niż 100 znaków' }),
    description: z
        .string()
        .max(500, { message: 'Opis zadania nie może być dłuższy niż 500 znaków' })
        .optional()
        .nullable(),
    badgeId: z.string().optional().nullable()
})

export const CreateTaskSchema = TaskSchema
export const UpdateTaskSchema = TaskSchema.extend({ id: uuid() })

export type Task = z.infer<typeof TaskSchema>
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>
export type DeleteTaskDTO = { id: string }
