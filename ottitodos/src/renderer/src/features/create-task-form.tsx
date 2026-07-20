import Input from '@renderer/components/input/input'
import TextArea from '@renderer/components/text-area/text-area'
import { useRef } from 'react'
import { useOnClickOutside } from '@renderer/hooks/useOnClickOutside'
import { useTaskActions } from './task/hooks/useTaskActions'

export default function CreateTaskForm({
    listId,
    columnId,
    onCloseForm
}: {
    listId: string
    columnId: string
    onCloseForm: () => void
}) {
    const FormRef = useRef<HTMLFormElement>(null)
    useOnClickOutside(FormRef, () => onCloseForm())
    const { createTask, isCreating } = useTaskActions(listId)

    return (
        <form
            ref={FormRef}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
                e.preventDefault()

                const formData = new FormData(e.currentTarget)

                createTask(formData)
                onCloseForm()
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
                <button type="submit" disabled={isCreating}>
                    Dodaj
                </button>
            </div>
        </form>
    )
}
