import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { relations } from './relations'

const dbUrl = process.env.DB_FILE_NAME
if (!dbUrl) {
    throw new Error('DB_FILE_NAME nie jest zdefiniowane w pliku .env!')
}

console.log('Łączenie z bazą:', dbUrl)

const client = createClient({ url: dbUrl })
export const db = drizzle({ client, relations })
