import { useState } from 'react'

export default function SubTask() {
    const [editSubTask, setEditSubTask] = useState<boolean>(false)

    return (
        <form
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
