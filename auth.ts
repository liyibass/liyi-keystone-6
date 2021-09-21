import { createAuth } from '@keystone-next/auth'
import { sessionSetting } from './configs/config'
let { sessionSecret }: { sessionSecret: string } = sessionSetting

if (!sessionSecret) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error(
            'The SESSION_SECRET environment variable must be set in production'
        )
    } else {
        sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --'
    }
}

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    sessionData: 'name',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
    },
})

export { withAuth, sessionSecret }
