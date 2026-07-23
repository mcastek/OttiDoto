import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createTask,
    moveTask,
    reorderTask,
    TaskFormState
} from '../../../../formActions/task.actions'

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

    const reorderTaskMutation = useMutation({
        mutationFn: async ({ taskId, newPosition }: { taskId: string; newPosition: number }) =>
            await reorderTask(taskId, newPosition),
        onError: (error) => {
            console.error('Move/reorder failed:', error)
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    const moveTaskMutation = useMutation({
        mutationFn: async ({
            taskId,
            columnId,
            newPosition
        }: {
            taskId: string
            columnId: string
            newPosition: number
        }) => await moveTask(taskId, columnId, newPosition),
        onError: (error) => {
            console.error('Move failed:', error)
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
        }
    })

    return {
        createTask: createMutation.mutate,
        reorderTask: reorderTaskMutation.mutate,
        moveTask: moveTaskMutation.mutate,
        isCreating: createMutation.isPending
    }
}
