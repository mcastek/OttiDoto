import { useRef, useState } from 'react'
import type { SubTask } from 'src/db/schemas'

export default function SubTaskCard({ subTask_data }: { subTask_data: SubTask }) {
    const [editSubTask, setEditSubTask] = useState<boolean>(subTask_data.title === '')
    const FormRef = useRef<HTMLFormElement>(null)

    const onHandleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newFormData = new FormData(e.currentTarget)
    }

    return (
        <form
            ref={FormRef}
            onSubmit={onHandleSubmit}
            style={{
                backgroundColor: '#1F2736',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '.5em'
            }}
        >
            {editSubTask ? (
                <>
                    <input type="hidden" name="task_id" />
                    <input type="text" name="title" placeholder="Add subtask" />
                    <button type="button" onClick={() => {}}>
                        ❌
                    </button>
                    <button type="submit">✔️</button>
                </>
            ) : (
                <>
                    <input type="checkbox" />
                    <p>{'Name'}</p>
                </>
            )}
        </form>
    )
}
