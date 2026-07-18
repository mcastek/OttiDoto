import { CreateTasksColumn, CreateTasksColumnInputSchema } from '../../db/schemas'

export type ColumnFormState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

export async function createColumn(
    _prevState: ColumnFormState,
    formData: FormData
): Promise<ColumnFormState> {
    console.log('ping!')

    const validationData = CreateTasksColumnInputSchema.safeParse({
        name: formData.get('column_name'),
        listId: formData.get('list_id'),
        position: parseFloat(String(formData.get('position')))
    })

    if (!validationData.success) {
        console.log(validationData.error)
        return {
            success: false,
            errors: validationData.error.flatten().fieldErrors
        }
    }

    const { name, listId, position } = validationData.data

    const newColumnData: CreateTasksColumn = {
        id: null,
        name: name,
        listId: listId,
        editable: true,
        position: position
    }

    console.log(
        `Column: ${newColumnData.name} ${newColumnData.listId} ${newColumnData.editable} ${newColumnData.position}`
    )

    try {
        await window.columnApi.createColumn(newColumnData)
        return { success: true }
    } catch (error) {
        console.log('Cannot create new column:', error)
        return { success: false }
    }
}
