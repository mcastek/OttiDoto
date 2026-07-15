import { Activity, useState } from 'react'
import { Task, TasksColumn } from 'src/db/schemas'
import CreateTaskForm from '../create-task-form'
import { ColumnHeader } from './column-header'
import { useSortable } from '@dnd-kit/react/sortable'

type ColumnProps = {
    listId: string
    column: TasksColumn
    tasks?: Task[]
}

export default function Column({ listId, column, tasks }: ColumnProps) {
    const [openCreateCard, setOpenCreateCard] = useState<boolean>(false)
    const [edited, setEdited] = useState<boolean>(false)
    const { ref } = useSortable({
        id: column.id!,
        index: column.position,
        type: 'column',
        accept: ['task', 'column']
    })

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
                <ColumnHeader
                    listId={listId}
                    column_data={column}
                    onEdited={(e) => {
                        setEdited(e)
                        setOpenCreateCard(false)
                    }}
                />
                <Activity mode={column.name !== 'Done' ? 'visible' : 'hidden'}>
                    <button onClick={() => setOpenCreateCard((prev) => !prev)} disabled={edited}>
                        ➕
                    </button>
                </Activity>
            </div>
            <Activity mode={openCreateCard ? 'visible' : 'hidden'}>
                <CreateTaskForm
                    listId={listId}
                    columnId={column.id!}
                    onCloseForm={() => setOpenCreateCard(false)}
                />
            </Activity>
            <div>
                {tasks?.map((task) => (
                    <div key={task.id} style={{ backgroundColor: '#1F2736', padding: '.5em' }}>
                        {task.title}
                    </div>
                ))}
            </div>
        </div>
    )
}
