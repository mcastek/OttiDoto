import { registerColumnHandlers } from './ipc/column.handler'
import { registerTaskListHandlers } from './ipc/task-list.handler'
import { registerTaskHandlers } from './ipc/task.handler'

export default function initIpcHandlers() {
    registerTaskListHandlers()
    registerTaskHandlers()
    registerColumnHandlers()
}
