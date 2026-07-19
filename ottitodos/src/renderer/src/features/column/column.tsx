import { Activity, useCallback, useState } from 'react'
import { TasksColumn, TaskWithSubTasks } from 'src/db/schemas'
import CreateTaskForm from '../create-task-form'
import { ColumnHeader } from './column-header'
import { useSortable } from '@dnd-kit/react/sortable'
import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import TaskCard from '../task/task-card'
import { PointerSensor } from '@dnd-kit/react'

type ColumnProps = {
    column: TasksColumn
    tasks?: TaskWithSubTasks[]
}

export default function Column({ column, tasks }: ColumnProps) {
    const [openCreateCard, setOpenCreateCard] = useState<boolean>(false)
    const [edited, setEdited] = useState<boolean>(false)
    const { ref } = useSortable({
        id: column.id!,
        index: column.position,
        modifiers: [RestrictToHorizontalAxis],
        type: 'column',
        accept: ['task', 'column'],
        sensors: [
            PointerSensor.configure({
                activationConstraints: [
                    new PointerActivationConstraints.Delay({ value: 150, tolerance: 5 })
                ]
            })
        ]
    })

    const handleEdited = useCallback((e: boolean) => {
        setEdited(e)
        if (e) setOpenCreateCard(false)
    }, [])

    return (
        <div
            ref={ref}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
                {tasks?.map((task) => (
                    <TaskCard task_data={task} />
                ))}
            </div>
        </div>
    )
}
