import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const taskBadgesTable = sqliteTable('badge_table', {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text({ length: 100 }).notNull()
})