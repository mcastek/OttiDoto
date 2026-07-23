import { Activity, useCallback, useState } from 'react'
import { TasksColumn, TaskWithSubTasks } from 'src/db/schemas'
import CreateTaskForm from '../create-task-form'
import { ColumnHeader } from './column-header'
import { useSortable } from '@dnd-kit/react/sortable'
import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { TaskCard } from '../task/task-card'
import { PointerSensor, useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { closestCenter } from '@dnd-kit/collision'

type ColumnProps = {
    column: TasksColumn
    tasks?: TaskWithSubTasks[]
    children: React.ReactNode
}
const COLUMN_MODIFIERS = [RestrictToHorizontalAxis]
const COLUMN_ACCEPT = ['column']
const COLUMN_SENSORS = [
    PointerSensor.configure({
        activationConstraints: [
            new PointerActivationConstraints.Delay({ value: 150, tolerance: 5 })
        ]
    })
]

export default function Column({ column, tasks, children }: ColumnProps) {
    const [openCreateCard, setOpenCreateCard] = useState<boolean>(false)
    const [edited, setEdited] = useState<boolean>(false)
    const { ref: columnRef } = useSortable({
        id: column.id!,
        index: column.position,
        collisionPriority: CollisionPriority.Low,
        collisionDetector: closestCenter,
        modifiers: COLUMN_MODIFIERS,
        type: 'column',
        accept: COLUMN_ACCEPT,
        sensors: COLUMN_SENSORS
    })

    const { ref: taskListRef } = useDroppable({
        id: `container-${column.id}`,
        data: { type: 'task-list-container', columnId: column.id },
        accept: 'task'
    })

    const handleEdited = useCallback((e: boolean) => {
        setEdited(e)
        if (e) setOpenCreateCard(false)
    }, [])

    return (
        <div
            ref={columnRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '300px',
                width: '300px',
                height: '600px',
                backgroundColor: '#0d1521'
            }}
        >
            <div style={{ display: 'inline-flex', justifyContent: 'space-between' }}>
                <ColumnHeader column_data={column} onEdited={handleEdited} />
                <Activity mode={column.name !== 'Done' ? 'visible' : 'hidden'}>
                    <button onClick={() => setOpenCreateCard((prev) => !prev)} disabled={edited}>
                        ➕
                    </button>
                </Activity>
            </div>
            <Activity mode={openCreateCard ? 'visible' : 'hidden'}>
                <CreateTaskForm
                    listId={column.listId}
                    columnId={column.id!}
                    onCloseForm={() => setOpenCreateCard(false)}
                />
            </Activity>
            <div
                ref={taskListRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    gap: '.5em'
                }}
            >
                {children}
            </div>
        </div>
    )
}
