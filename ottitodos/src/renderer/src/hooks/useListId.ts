import { createContext, useContext } from 'react'

export const ListContext = createContext<string | null>(null)

export function useListId() {
    const context = useContext(ListContext)

    if (!context) {
        throw new Error('ListIdContext cannot be used without provider')
    }

    return context
}
