import { memo } from 'react'
import Column from '../../features/column/column'
import { TasksColumn, TaskWithSubTasks } from 'src/db/schemas'
import { TaskCard } from '../task/task-card'

type BorderProps = {
    allColumns: TasksColumn[]
    tasksByColumn: Record<string, TaskWithSubTasks[]>
}

export const BoardRenderer = memo(({ allColumns, tasksByColumn }: BorderProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            {allColumns.map((column) => {
                const tasks = (tasksByColumn[column.id!] || []).sort(
                    (a, b) => a.tasks.position - b.tasks.position
                )

                return (
                    <Column key={column.id} column={column} tasks={tasks}>
                        {tasks?.map((task, index) => (
                            <TaskCard key={task.tasks.id} index={index} task_data={task} />
                        ))}
                    </Column>
                )
            })}
        </div>
    )
})
