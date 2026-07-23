import { TaskWithSubTasks } from 'src/db/schemas'
import { calculateNewPosition } from './calculateNewPosition'

export const getNewLexorank = (
    tasksInColumn: TaskWithSubTasks[],
    activeId: string,
    overId: string
): number => {
    const sortedTasks = tasksInColumn
        .filter((t) => t.tasks.id !== activeId)
        .sort((a, b) => a.tasks.position - b.tasks.position)

    const overIndex = sortedTasks.findIndex((t) => t.tasks.id === overId)

    if (overIndex === -1) {
        const lastTask = sortedTasks[sortedTasks.length - 1]
        return calculateNewPosition(lastTask?.tasks.position, undefined)
    }

    const prevTask = sortedTasks[overIndex - 1]
    const nextTask = sortedTasks[overIndex]

    return calculateNewPosition(prevTask?.tasks.position, nextTask?.tasks.position)
}
