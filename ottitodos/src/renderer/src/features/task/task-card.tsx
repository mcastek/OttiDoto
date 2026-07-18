import { useDraggable } from '@dnd-kit/react'

import type { Task } from 'src/db/schemas'
import SubTaskList from '../sub-tasks/sub-task-list'
import { Activity, useEffect, useState } from 'react'

export default function TaskCard({ task_data }: { task_data: Task }) {
    const [showSubTasks, setShowSubTasks] = useState<boolean>(true)
    const { ref, isDragging } = useDraggable({
        id: task_data.id!,
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
                <p>{task_data.title}</p>
                <p>{task_data.description}</p>
            </div>
            <Activity mode={showSubTasks ? 'visible' : 'hidden'}>
                <SubTaskList />
            </Activity>
        </div>
    )
}
