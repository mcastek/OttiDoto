import { CreateSubTask, CreateSubTaskInputSchema } from '../../db/schemas'

export type subTaskPayload = Omit<CreateSubTask, 'title' | 'description'>

export type SubTaskFormState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

async function createSubTask(
    _prevState: SubTaskFormState,
    formData: FormData,
    payload: subTaskPayload
) {
    const validationData = CreateSubTaskInputSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description')
    })

    if (!validationData.success) {
        return {
            success: false,
            errors: validationData.error.flatten().fieldErrors
        }
    }

    const { title, description } = validationData.data

    const newSubTask: CreateSubTask = { ...payload, title, description }
    console.log(newSubTask)
    try {
        await window.subTaskApi.createSubTask(newSubTask)
        return { success: true }
    } catch (error) {
        console.log('Cannot create new subtask', error)
        return { success: false, message: 'Cannod create new subTask' }
    }
}

async function deleteSubTask(subTaskId: string) {
    try {
        await window.subTaskApi.deleteSubTask(subTaskId)
        return { success: true }
    } catch (error) {
        console.log('Delete action: ', error)
        return { success: false }
    }
}

async function changeStatus(subTaskId: string, status: boolean) {
    try {
        await window.subTaskApi.changeStatus({ subTaskId, status })
        return { success: true }
    } catch (error) {
        console.log('Action: ', error)
        return { success: false }
    }
}

export { createSubTask, deleteSubTask, changeStatus }
