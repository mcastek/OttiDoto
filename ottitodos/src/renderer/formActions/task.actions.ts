import { CreateTaskSchema } from '../../db/schemas'

export type TaskFormState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

export async function createTask(
    _prevState: TaskFormState,
    formData: FormData
): Promise<TaskFormState> {
    const ValidationData = CreateTaskSchema.safeParse({
        listId: formData.get('list_id'),
        columnId: formData.get('column_id'),
        title: formData.get('title_task'),
        description: formData.get('description_task')
    })

    if (!ValidationData.success) {
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
