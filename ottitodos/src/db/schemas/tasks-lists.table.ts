import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { InferSelectModel } from 'drizzle-orm/table'
import { createInsertSchema } from 'drizzle-orm/zod'
import z from 'zod'
import { Task } from './tasks.table'
import { TasksColumn } from './tasks-columns.table'

export const tasksListsTable = sqliteTable('tasks_lists_table', {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    emblem: text({ length: 10 }).notNull(),
    emblemColor: text({ length: 20 }).notNull(),
    name: text({ length: 100 }).notNull(),
    createdAt: text()
        .$defaultFn(() => new Date().toISOString())
        .notNull(),
    fromDate: text(),
    toDate: text()
})

export const tasksListsSchema = createInsertSchema(tasksListsTable, {
    name: z
        .string()
        .min(1, { message: 'Nazwa listy nie może być pusta' })
        .max(100, { message: 'Nazwa listy nie może być dłuższa niż 100 znaków' }),
    emblem: z
        .string()
        .min(1, { message: 'Emblemat listy nie może być pusty' })
        .max(10, { message: 'Emblemat listy nie może być dłuższy niż 10 znaków' }),
    emblemColor: z
        .string()
        .min(1, { message: 'Kolor emblematy listy nie może być pusty' })
        .max(20, { message: 'Kolor emblematy listy nie może być dłuższy niż 20 znaków' }),
    fromDate: z.string().optional(),
    toDate: z.string().optional()
})

export const CreateTasksListSchema = tasksListsSchema

export type TasksList = InferSelectModel<typeof tasksListsTable>
export type CreateTasksListDTO = z.infer<typeof tasksListsSchema>
export type DeleteTaskListDTO = {
    id: string
}
