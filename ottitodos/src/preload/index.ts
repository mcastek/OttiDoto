import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { CreateTasksListDTO } from '../db/schemas/tasks-lists.table'
import { ChangeStatusProps } from './index.d'
import { CreateSubTask, CreateTaskDTO, CreateTasksColumn } from '../db/schemas'

// Custom APIs for renderer
const api = {}

// APIs for renderer task list
const taskListApi = {
    createTaskList: (list_data: CreateTasksListDTO) =>
        ipcRenderer.invoke('add-task-list', list_data),
    getAllTaskLists: () => ipcRenderer.invoke('get-all-task-lists'),
    getListBoard: (listId: string) => ipcRenderer.invoke('get-list-board', listId),
    deleteTaskList: (id: string) => ipcRenderer.invoke('delete-task-list', id)
}

const columnApi = {
    createColumn: (column_data: CreateTasksColumn) =>
        ipcRenderer.invoke('create-column', column_data),
    deleteColumn: (id: string) => ipcRenderer.invoke('delete-column', id)
}

const taskApi = {
    getAllTasksByList: (listId: string) => ipcRenderer.invoke('get-all-tasks-by-list', listId),
    createTask: (task_data: CreateTaskDTO) => ipcRenderer.invoke('create-task', task_data),
    deleteTask: (taskId: string) => ipcRenderer.invoke('delete-task', taskId),
    changeColumn: (taskId: string, columnId: string) =>
        ipcRenderer.invoke('change-column', taskId, columnId)
}

const subTaskApi = {
    createSubTask: (subTask_data: CreateSubTask) =>
        ipcRenderer.invoke('create-subTask', subTask_data),
    deleteSubTask: (subTaskid: string) => ipcRenderer.invoke('delete-subTask', subTaskid),
    changeStatus: ({ subTaskId, status }: ChangeStatusProps) =>
        ipcRenderer.invoke('change-status', { subTaskId, status })
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
        contextBridge.exposeInMainWorld('taskListApi', taskListApi)
        contextBridge.exposeInMainWorld('taskApi', taskApi)
        contextBridge.exposeInMainWorld('columnApi', columnApi)
        contextBridge.exposeInMainWorld('subTaskApi', subTaskApi)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
    // @ts-ignore
    window.taskListApi = taskListApi
    // @ts-ignore
    window.taskApi = taskApi
    // @ts-ignore
    window.columnApi = columnApi
}
