import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    changeStatus,
    createSubTask,
    deleteSubTask,
    SubTaskFormState,
    subTaskPayload
} from '../../../../formActions/subtask.actions'
import { listBoardData } from '../../../../../db/schemas'

const initialState: SubTaskFormState = {
    success: false,
    errors: {},
    message: ''
}

export default function useSubTaskActions(listId: string) {
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: async ({
            formData,
            payload
        }: {
            formData: FormData
            payload: subTaskPayload
        }) => await createSubTask(initialState, formData, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', listId] })
    })

    const deleteMutation = useMutation({
        mutationFn: async (subTaskId: string) => await deleteSubTask(subTaskId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', listId] })
    })

    const changeStatusMutation = useMutation({
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

    return {
        createSubTask: createMutation.mutate,
        deleteSubTask: deleteMutation.mutate,
        changeStatus: changeStatusMutation.mutate,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending
    }
}
