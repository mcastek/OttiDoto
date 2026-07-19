import {
    registerColumnHandlers,
    registerSubTaskHandlers,
    registerTaskHandlers,
    registerTaskListHandlers
} from './ipc'

export default function initIpcHandlers() {
    registerTaskListHandlers()
    registerTaskHandlers()
    registerColumnHandlers()
    registerSubTaskHandlers()
}
