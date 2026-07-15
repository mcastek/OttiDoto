import TasksList from '@renderer/features/tasks-list'
import TasksListForm from '@renderer/features/tasks-list-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lists/tasks-list-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
            <TasksListForm />
            <TasksList />
        </div>
}
