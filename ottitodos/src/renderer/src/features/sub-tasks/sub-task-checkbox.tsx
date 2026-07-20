import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeStatus } from '../../../formActions/subtask.actions'
import { useListId } from '@renderer/hooks/useListId'
import { listBoardData } from '../../../../db/schemas'

export const CheckBox = ({ subTaskId, status }: { subTaskId: string; status: boolean }) => {
    const queryClient = useQueryClient()
    const listId = useListId()

    const mutation = useMutation({
        mutationFn: async ({ subTaskId, status }: { subTaskId: string; status: boolean }) => {
            console.log(subTaskId, status)
            await changeStatus(subTaskId, status)
        },
        onMutate: async ({ subTaskId, status }: { subTaskId: string; status: boolean }) => {
            await queryClient.cancelQueries({ queryKey: ['board', listId] })

            const previousQuery = queryClient.getQueryData(['board', listId])

            queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => ({
                ...oldBoard,
                taskWithSubTasks: oldBoard.taskWithSubTasks.map((item) => {
                    return {
                        ...item,
                        subTasks: item.subTasks.map((subTask) =>
                            subTask.id === subTaskId ? { ...subTask, status } : subTask
                        )
                    }
                })
            }))

            return { previousQuery }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['board', listId], context?.previousQuery)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    return (
        <input
            name="status"
            type="checkbox"
            checked={status}
            onChange={() => {
                mutation.mutate({ subTaskId, status: !status })
            }}
        />
    )
}
