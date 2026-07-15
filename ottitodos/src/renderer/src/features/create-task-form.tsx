import Input from '@renderer/components/input/input'
import TextArea from '@renderer/components/text-area/text-area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, TaskFormState } from '../../formActions/task.actions'

const initialState: TaskFormState = {
    success: false,
    errors: {},
    message: ''
}

export default function CreateTaskForm({
    listId,
    columnId,
    onCloseForm
}: {
    listId: string
    columnId: string
    onCloseForm: () => void
}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => await createTask(initialState, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', listId] })
            onCloseForm()
        }
    })

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)

                    mutation.mutate(formData)
                }}
            >
                <Input name="column_id" type="hidden" value={columnId} />
                <Input name="list_id" type="hidden" value={listId} />
                <Input name="title_task" labelName="Title" placeholder="Task title" />
                <TextArea
                    name="description_task"
                    labelName="Description"
                    placeholder="add some text..."
                />
                {mutation.error?.message}
                <div
                    style={{
                        display: 'flex',
                        gap: '.5em',
                        width: '100%',
                        justifyContent: 'end'
                    }}
                >
                    <button type="button" onClick={onCloseForm}>
                        Anuluj
                    </button>
                    <button type="submit" disabled={mutation.isPending}>
                        Dodaj
                    </button>
                </div>
            </form>
        </>
    )
}
