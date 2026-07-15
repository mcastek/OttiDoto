import { DragDropProvider } from '@dnd-kit/react'
import Column from '../../features/column/column'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { listBoardData, TasksColumn } from 'src/db/schemas'

export const Route = createFileRoute('/lists/$listId')({
    component: RouteComponent
})

const COLUMNSTATE: TasksColumn[] = [
    { id: 'todo', name: 'To Do', editable: false, position: 1 },
    { id: 'inProgress', name: 'In progress', editable: false, position: 2 },
    { id: 'success', name: 'Done', editable: false, position: 3 }
]

function RouteComponent() {
    const { listId } = Route.useParams()
    const queryClient = useQueryClient()

    const { data: board, isLoading } = useQuery({
        queryKey: ['board', listId],
        queryFn: async () => await window.taskListApi.getListBoard(listId)
    })

    const allColumns: TasksColumn[] = useMemo(() => {
        const staticColumns = COLUMNSTATE.map((col) => ({ ...col, listId }))
        return [...staticColumns, ...(board?.columns || [])].sort((a, b) => a.position - b.position)
    }, [listId, board?.columns])

    const handleAddNewColumn = () => {
        const newColumn = {
            name: '',
            listId: listId,
            editable: true,
            position: board ? board.columns.length / 100 : 0
        }

        queryClient.setQueryData(['board', listId], (oldBoard: any) => ({
            ...oldBoard,
            columns: [...oldBoard.columns, newColumn]
        }))
    }

    if (isLoading) return <div>Loading...</div>

    const tasks = board ? board.tasks : []

    return (
        <div>
            Hello "/lists/${listId}!<button onClick={handleAddNewColumn}>+</button>
            <div style={{ width: '1200px' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1rem',
                        width: '100%',
                        overflow: 'hidden',
                        overflowX: 'auto'
                    }}
                >
                    <DragDropProvider
                        onDragEnd={(event) => {
                            const { source, target } = event.operation

                            if (event.canceled || !target) return

                            if (source?.type === 'column' && target?.type === 'column') {
                                const oldIndex = allColumns.findIndex((col) => col.id === source.id)
                                const newIndex = allColumns.findIndex((col) => col.id === target.id)

                                if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
                                    return

                                const reorderedColumns = [...allColumns]
                                const [movedColumn] = reorderedColumns.splice(oldIndex, 1)
                                reorderedColumns.splice(newIndex, 0, movedColumn)

                                const updatedColumns = reorderedColumns.map((col, index) => ({
                                    ...col,
                                    position: index + 1
                                }))

                                queryClient.setQueryData(['board', listId], (oldBoard: any) => {
                                    if (!oldBoard) return

                                    const staticIds = COLUMNSTATE.map((c) => c.id)
                                    const dynamicUpdatedColumns = updatedColumns.filter(
                                        (col) => !staticIds.includes(col.id)
                                    )

                                    return {
                                        ...oldBoard,
                                        columns: dynamicUpdatedColumns
                                    }
                                })
                            }
                        }}
                    >
                        {allColumns.map((column) => (
                            <Column
                                key={`${crypto.randomUUID()}-${column.position}`}
                                listId={listId}
                                column={column}
                                tasks={tasks.filter((task) => task.columnId === column.id)}
                            />
                        ))}
                    </DragDropProvider>
                </div>
            </div>
        </div>
    )
}
