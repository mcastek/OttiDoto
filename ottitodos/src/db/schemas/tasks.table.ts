import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { taskBadgesTable } from './task-badges.table'
import { tasksListsTable } from './tasks-lists.table'
import { createInsertSchema } from 'drizzle-orm/zod'
import z, { uuid } from 'zod'

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
    description: text({ length: 500 }),
    position: integer().notNull()
})

export const TaskSchema = createInsertSchema(tasksTable, {
    id: z.uuid(),
    title: z
        .string()
        .min(1, { message: 'Nazwa zadania nie może być pusta' })
        .max(100, { message: 'Nazwa zadania nie może być dłuższa niż 100 znaków' }),
    description: z
        .string()
        .max(500, { message: 'Opis zadania nie może być dłuższy niż 500 znaków' })
        .nullable(),
    badgeId: z.string().nullable().optional()
})
export const TaskCardSchema = TaskSchema.extend({ id: z.uuid().nullable() })
export const CreateTaskSchema = TaskSchema.omit({ id: true, position: true })
export const UpdateTaskSchema = TaskSchema.extend({ id: uuid() })

export type Task = z.infer<typeof TaskSchema>
export type TaskCardProps = z.infer<typeof TaskCardSchema>
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>
export type DeleteTaskDTO = { id: string }
