export default function SubTaskList() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: "2em" }}>
            <div
                style={{
                    backgroundColor: '#1F2736',
                    display: 'flex',
                    justifyContent: "space-between",
                    padding: '.5em'
                }}
            >
                <p>SubTasks (0)</p>
                <button>➕</button>
            </div>
        </div>
    )
}
