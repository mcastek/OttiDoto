import { SubTask, Task, TasksColumn } from './index'

export type TaskWithSubTasks = {
    tasks: Task
    subTasks: SubTask[]
}

export type listBoardData = {
    taskWithSubTasks: TaskWithSubTasks[]
    columns: TasksColumn[]
}
