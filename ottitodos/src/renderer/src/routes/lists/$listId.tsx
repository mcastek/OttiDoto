/* @refresh reset */
import { DragDropProvider } from '@dnd-kit/react'

import { flushSync } from 'react-dom'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { listBoardData, TasksColumn, TaskWithSubTasks } from 'src/db/schemas'
import { ListContext } from '@renderer/hooks/useListId'
import { useTaskActions } from '@renderer/features/task/hooks/useTaskActions'
import { isSortable } from '@dnd-kit/react/sortable'
import { calculateNewPosition } from '@renderer/utils/calculateNewPosition'
import { BoardRenderer } from '@renderer/features/board/board'
import { move } from '@dnd-kit/helpers'
import { getNewLexorank } from '@renderer/utils/getNewLexoRank'

export const Route = createFileRoute('/lists/$listId')({
    component: RouteComponent
})

type StaticColumn = { id: string; name: string; editable: boolean; position: number }

const COLUMNSTATE: StaticColumn[] = [
    { id: 'todo', name: 'To Do', editable: false, position: 1 },
    { id: 'inProgress', name: 'In progress', editable: false, position: 2 },
    { id: 'success', name: 'Done', editable: false, position: 3 }
]

function RouteComponent() {
    const { listId } = Route.useParams()
    const queryClient = useQueryClient()
    const { moveTask, reorderTask } = useTaskActions(listId)
    const sourceParentRef = useRef<Element | null>(null)

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
            position: board ? (board.columns.length + 1) / 100 : 0
        }

        queryClient.setQueryData(['board', listId], (oldBoard: any) => ({
            ...oldBoard,
            columns: [...oldBoard.columns, newColumn]
        }))
    }

    const tasksByColumn = useMemo(() => {
        if (!board) return {}

        return board.taskWithSubTasks.reduce(
            (acc, task) => {
                const colId = task.tasks.columnId
                if (!acc[colId]) {
                    acc[colId] = []
                }
                acc[colId].push(task)
                return acc
            },
            {} as Record<string, TaskWithSubTasks[]>
        )
    }, [board])

    if (isLoading) return <div>Loading...</div>

    return (
        <ListContext value={listId}>
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
                        key={listId}
                        onDragStart={(event) => {
                            sourceParentRef.current =
                                event.operation.source?.element?.parentElement ?? null
                        }}
                        onDragOver={({ operation }) => {
                            const { source, target } = operation
                            console.log(`${source?.id} is over ${target?.id}`)
                        }}
                        onDragEnd={(event) => {
                            const { source, target } = event.operation

                            const sourceElement = event.operation.source?.element
                            const prevParent = sourceParentRef.current
                            sourceParentRef.current = null
                            if (
                                sourceElement &&
                                prevParent &&
                                sourceElement.parentElement !== prevParent
                            ) {
                                prevParent.appendChild(sourceElement)
                            }

                            if (event.canceled || !source || !target) return
                            if (source.type !== 'task' || !isSortable(source)) return

                            const { initialGroup, group, initialIndex, index } = source

                            const taskId = source.id as string

                            const columnId =
                                typeof target.id === 'string' && target.id.startsWith('container-')
                                    ? target.id.replace('container-', '')
                                    : (group as string)

                            if (initialIndex === index && initialGroup === columnId) return

                            console.log(`Task: ${taskId}, column: ${columnId}`)

                            const currentBoard = queryClient.getQueryData([
                                'board',
                                listId
                            ]) as listBoardData
                            if (!currentBoard) return

                            const tasksInTargetGroup = currentBoard.taskWithSubTasks
                                .filter(
                                    (item) =>
                                        item.tasks.columnId === columnId && item.tasks.id !== taskId
                                )
                                .sort((a, b) => a.tasks.position - b.tasks.position)

                            const prevTask = tasksInTargetGroup[index - 1]
                            const nextTask = tasksInTargetGroup[index]
                            const newPosition = calculateNewPosition(
                                prevTask?.tasks?.position,
                                nextTask?.tasks?.position
                            )

                            flushSync(() => {
                                queryClient.setQueryData(
                                    ['board', listId],
                                    (old: listBoardData) => {
                                        if (!old) return old
                                        const updatedTasks = old.taskWithSubTasks.map((t) =>
                                            t.tasks.id === taskId
                                                ? {
                                                      ...t,
                                                      tasks: {
                                                          ...t.tasks,
                                                          columnId,
                                                          position: newPosition
                                                      }
                                                  }
                                                : t
                                        )
                                        return { ...old, taskWithSubTasks: updatedTasks }
                                    }
                                )
                            })

                            if (initialGroup !== columnId) {
                                moveTask({ taskId, columnId, newPosition })
                            } else {
                                reorderTask({ taskId, newPosition })
                            }
                        }}
                    >
                        <BoardRenderer allColumns={allColumns} tasksByColumn={tasksByColumn} />
                    </DragDropProvider>
                </div>
            </div>
        </ListContext>
    )
}
