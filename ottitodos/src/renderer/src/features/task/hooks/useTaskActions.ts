import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, moveTask, TaskFormState } from '../../../../formActions/task.actions'
import { listBoardData } from 'src/db/schemas'

const initialState: TaskFormState = {
    success: false,
    errors: {},
    message: ''
}

export function useTaskActions(listId: string) {
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: async (formData: FormData) => await createTask(initialState, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    const moveTaskMutation = useMutation({
        mutationFn: async ({ taskId, columnId }: { taskId: string; columnId: string }) =>
            await moveTask(taskId, columnId),

        onMutate: ({ taskId, columnId }: { taskId: string; columnId: string }) => {
            queryClient.cancelQueries({ queryKey: ['board', listId] })

            const previousQuery = queryClient.getQueryData(['board', listId])

            queryClient.setQueryData(['board', listId], (oldBoard: listBoardData) => ({
                ...oldBoard,
                taskWithSubTasks: oldBoard.taskWithSubTasks.map((item) => {
                    return {
                        ...item,
                        tasks: item.tasks.id === taskId ? { ...item.tasks, columnId } : item.tasks
                    }
                })
            }))

            return { previousQuery }
        },
        onError: (_, __, context) =>
            queryClient.setQueryData(['board', listId], context?.previousQuery),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    return {
        createTask: createMutation.mutate,
        moveTask: moveTaskMutation.mutate,
        isCreating: createMutation.isPending
    }
}
