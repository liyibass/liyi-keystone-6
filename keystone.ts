import { config } from '@keystone-next/keystone'
import { statelessSessions } from '@keystone-next/keystone/session'

import { lists } from './schema'
import { withAuth, sessionSecret } from './auth'
import { sessionSetting, database } from './configs/config'
let { sessionMaxAge } = sessionSetting

const session = statelessSessions({
    maxAge: sessionMaxAge,
    secret: sessionSecret!,
})

export default withAuth(
    config({
        db: {
            provider: database.provider || 'postgresql',
            url:
                database.url ||
                'postgres://keystone:mirror-tv@localhost/israfel',
            idField: { kind: 'autoincrement' },
        },
        ui: {
            isAccessAllowed: (context) => !!context.session?.data,
        },
        lists,
        session,
    })
)
