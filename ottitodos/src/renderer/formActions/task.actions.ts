import { CreateTaskSchema } from '../../db/schemas'

export type TaskFormState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

async function createTask(_prevState: TaskFormState, formData: FormData): Promise<TaskFormState> {
    console.log('ping!')

    const ValidationData = CreateTaskSchema.safeParse({
        listId: formData.get('list_id'),
        columnId: formData.get('column_id'),
        title: formData.get('title_task'),
        description: formData.get('description_task')
    })

    if (!ValidationData.success) {
        console.log(ValidationData.error)
        return {
            success: false,
            errors: ValidationData.error.flatten().fieldErrors
        }
    }

    const { title, description, listId, columnId } = ValidationData.data

    console.log(`${title}, ${description}, ${listId}, ${columnId}`)

    try {
        await window.taskApi.createTask(ValidationData.data)
        return { success: true }
    } catch (error) {
        console.log('Cannot add new Task', error)
        return { success: false, message: `${error}` }
    }
}

async function moveTask(taskId: string, columnId: string, newPosition: number) {
    try {
        console.log('Moving to other column...', columnId)
        await window.taskApi.moveTask(taskId, columnId, newPosition)
    } catch (error) {
        console.log(`Cannot move Task`)
    }
}

async function reorderTask(taskId: string, position: number) {
    try {
        console.log('Reordering action...')
        await window.taskApi.reorderTask(taskId, position)
    } catch (error) {
        console.log(`Cannot reorder Task`)
    }
}

export { createTask, moveTask, reorderTask }
