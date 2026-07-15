import { defineRelations } from 'drizzle-orm'
import {
    tasksColumnsTable,
    tasksListsTable,
    tasksTable,
    subTasksTable,
    taskBadgesTable
} from './schemas'

const allSchema = {
    tasksListsTable,
    tasksColumnsTable,
    tasksTable,
    subTasksTable,
    taskBadgesTable
}

export const relations = defineRelations(allSchema, (r) => ({
    tasksListsTable: {
        columns: r.many.tasksColumnsTable({
            from: r.tasksListsTable.id,
            to: r.tasksColumnsTable.listId
        }),
        tasks: r.many.tasksTable({
            from: r.tasksListsTable.id,
            to: r.tasksTable.listId
        })
    },
    tasksTable: {
        column: r.one.tasksColumnsTable({
            from: r.tasksTable.columnId,
            to: r.tasksColumnsTable.id
        }),
        list: r.one.tasksListsTable({
            from: r.tasksTable.listId,
            to: r.tasksListsTable.id
        }),
        subTasks: r.many.subTasksTable({
            from: r.tasksTable.id,
            to: r.subTasksTable.taskId
        })
    },
    taskBadgesTable: {
        task: r.one.tasksTable({
            from: r.taskBadgesTable.id,
            to: r.tasksTable.badgeId
        })
    }
}))
