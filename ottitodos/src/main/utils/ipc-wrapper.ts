import { ipcMain } from 'electron'

export const handleIpc = (channel: string, handler: (event: any, ...args: any[]) => Promise<any>) => {
    ipcMain.handle(channel, async (event, ...args) => {
        try {
            return handler(event, ...args)
        } catch (error) {
            console.error(`Error in ${channel}:`, error)
            return { success: false, error: 'Internal Server Error' }
        }
    })
}
