import { CreateTasksColumn, CreateColumnInputSchema } from '../../db/schemas'

export type ColumnPayload = Omit<CreateTasksColumn, 'name'>

export type ColumnFormState = {
    success: boolean
    errors?: Record<string, string | string[]>
    message?: string
}

export async function createColumn(
    _prevState: ColumnFormState,
    formData: FormData,
    payload: ColumnPayload
): Promise<ColumnFormState> {
    console.log('ping!')

    const validationData = CreateColumnInputSchema.safeParse({
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

    const { name } = validationData.data

    const newColumn = {...payload, name}

    console.log(
        `Column: ${newColumn.name} ${newColumn.listId} ${newColumn.editable} ${newColumn.position}`
    )

    try {
        await window.columnApi.createColumn(newColumn)
        return { success: true }
    } catch (error) {
        console.log('Cannot create new column:', error)
        return { success: false }
    }
}
