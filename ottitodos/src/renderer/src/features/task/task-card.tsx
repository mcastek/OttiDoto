import type { TaskWithSubTasks } from 'src/db/schemas'
import SubTaskList from '../sub-tasks/sub-task-list'
import { Activity, memo, useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'

export const TaskCard = memo(
    ({ task_data, index }: { task_data: TaskWithSubTasks; index: number }) => {
        const [showSubTasks, setShowSubTasks] = useState<boolean>(true)

        const taskInfo = task_data.tasks
        const subTasks = task_data.subTasks ? task_data.subTasks : []
        const { ref, isDragging } = useSortable({
            id: taskInfo.id,
            index,
            group: taskInfo.columnId,
            type: 'task',
            accept: 'task'
        })

        useEffect(() => {
            setShowSubTasks(!isDragging)
        }, [isDragging])

        return (
            <div ref={ref} data-dragging={isDragging}>
                <div
                    style={{
                        backgroundColor: '#1F2736',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '.5em',
                        marginBottom: '.2em'
                    }}
                >
                    <p>{taskInfo.title}</p>
                    <p>{taskInfo.position}</p>
                    <p>{taskInfo.description}</p>
                </div>
                <Activity mode={showSubTasks ? 'visible': 'hidden'}>
                    <SubTaskList taskId={taskInfo.id} subtask_data={subTasks} />
                </Activity>
            </div>
        )
    }
)
