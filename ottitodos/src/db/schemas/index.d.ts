import { SubTask, Task, TasksColumn } from './index'

export type TaskWithSubTasks = {
    tasks: Task
    subTasks: SubTask | null
}

export type listBoardData = {
    taskWithSubTasks: TaskWithSubTasks[]
    columns: TasksColumn[]
}
