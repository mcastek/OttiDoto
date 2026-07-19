import { useDraggable } from '@dnd-kit/react'

import type { TaskWithSubTasks } from 'src/db/schemas'
import SubTaskList from '../sub-tasks/sub-task-list'
import { Activity, useEffect, useState } from 'react'

export default function TaskCard({ task_data }: { task_data: TaskWithSubTasks }) {
    const [showSubTasks, setShowSubTasks] = useState<boolean>(true)

    const taskInfo = task_data.tasks
    const subTasks = task_data.subTasks ? task_data.subTasks : []
    const { ref, isDragging } = useDraggable({
        id: taskInfo.id,
        type: 'task'
    })

    useEffect(() => {
        isDragging ? setShowSubTasks(false) : setShowSubTasks(true)
    }, [isDragging])

    return (
        <div>
            <div
                ref={ref}
                data-dragging={isDragging}
                style={{
                    backgroundColor: '#1F2736',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '.5em',
                    marginBottom: '.2em'
                }}
            >
                <p>{taskInfo.title}</p>
                <p>{taskInfo.description}</p>
            </div>
            <Activity mode={showSubTasks ? 'visible' : 'hidden'}>
                <SubTaskList listId={taskInfo.listId} taskId={taskInfo.id} subtask_data={subTasks} />
            </Activity>
        </div>
    )
}
