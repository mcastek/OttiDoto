import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export default function TasksList() {
    const {
        data: tasksLists,
        isPending,
        isError
    } = useQuery({
        queryKey: ['tasks-lists'],
        queryFn: () => window.taskListApi.getAllTaskLists()
    })

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error</span>
    }

    return (
        <>
            <ul>
                {tasksLists?.map((list) => (
                    <li key={list.id}>
                        <Link to="/lists/$listId" params={{ listId: list.id }}>
                            <div style={{color: 'white'}}>
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: list.emblemColor,
                                        marginRight: '5px',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    {list.emblem}
                                </div>

                                {list.name}
                                {` | ${list.fromDate} - ${list.toDate}`}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}
