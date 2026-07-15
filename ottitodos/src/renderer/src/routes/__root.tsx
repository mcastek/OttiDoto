import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
    <>
        <Link to="/lists/tasks-list-page" >Go to list</Link>
        <Outlet />
    </>
)

export const Route = createRootRoute({ component: RootLayout })
