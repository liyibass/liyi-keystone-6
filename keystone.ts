import { config } from '@keystone-next/keystone'
import { statelessSessions } from '@keystone-next/keystone/session'

import { withAuth, sessionSecret } from './auth'
import { sessionSetting } from './configs/config'
const { sessionMaxAge }: { sessionMaxAge: number } = sessionSetting

import { lists } from './schema'
import {
    db,
    ui,
    server,
    graphql,
    extendGraphqlSchema,
    files,
} from './systemConfiguration'

const session = statelessSessions({
    maxAge: sessionMaxAge,
    secret: sessionSecret!,
})

export default withAuth(
    /*
     * System Configuration API
     * representing all the configurable parts of the system
     * https://keystonejs.com/docs/apis/config#images
     */
    config({
        lists,
        db,
        ui,
        server,
        session,
        graphql,
        extendGraphqlSchema,
        files,
    })
)
