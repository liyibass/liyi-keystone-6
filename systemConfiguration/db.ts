import type { DatabaseConfig } from '@keystone-next/keystone/types'
import { database } from '../configs/config'

export const db: DatabaseConfig = {
    provider: database.provider || 'sqlite',
    url: database.url || './keystone.db',
    idField: { kind: 'autoincrement' },
}
