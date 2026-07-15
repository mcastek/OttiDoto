import { CreateTasksListSchema } from '../../db/schemas'

export type TasksListState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

export async function createTasksListDTO(_prevState: TasksListState, formData: FormData) {
    const validateData = CreateTasksListSchema.safeParse({
        name: formData.get('name'),
        emblem: formData.get('emblem'),
        emblemColor: formData.get('color-emblem'),
        fromDate: formData.get('from-date'),
        toDate: formData.get('to-date')
    })

    if (!validateData.success) {
        return {
            success: false,
            errors: validateData.error.flatten().fieldErrors
        }
    }

    const { emblem, emblemColor, name } = validateData.data

    console.log(`validated data: ${emblem}, ${emblemColor}, ${name}`)

    try {
        await window.taskListApi.createTaskList(validateData.data)
        return { success: true }
    } catch (error) {
        console.log(`Cannot add new list: ${error}`)
        return { success: false, message: error }
    }
}
