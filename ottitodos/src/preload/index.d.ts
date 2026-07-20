import { ElectronAPI } from '@electron-toolkit/preload'
import type { TasksList, CreateTasksListDTO } from '../db/schemas/tasks-lists.table'
import {
    CreateSubTask,
    CreateTaskDTO,
    CreateTasksColumn,
    listBoardData,
    Task
} from 'src/db/schemas'

declare global {
    interface Window {
        electron: ElectronAPI
        api: unknown
        taskListApi: {
            getAllTaskLists: () => Promise<TasksList[]>
            getListBoard: (listId: string) => Promise<listBoardData>
            createTaskList: (list_data: CreateTasksListDTO) => Promise<any>
            deleteTaskList: (id: string) => Promise<void>
        }
        taskApi: {
            getAllTasksByList: (listId: string) => Promise<Task[]>
            createTask: (task_data: CreateTaskDTO) => Promise<void>
            deleteTask: (taskId: string) => Promise<void>
            moveTask: (taskId: string, columnId: string) => Promise<void>
        }
        subTaskApi: {
            createSubTask: (subTask_data: CreateSubTask) => Promise<void>
            deleteSubTask: (subTaskId: string) => Promise<void>
            changeStatus: ({ subTaskId, status }: ChangeStatusProps) => Promise<void>
        }
        columnApi: {
            createColumn: (column_data: CreateTasksColumn) => Promise<void>
            deleteColumn: (id: string) => Promise<void>
        }
    }
}

export type ChangeStatusProps = {
    subTaskId: string
    status: boolean
}
