import type { ServerConfig } from '@keystone-next/keystone/types'

export const server: ServerConfig = {
    cors: undefined,
    port: 3000,
    maxFileSize: 50 * 1024 * 1024,
    extendExpressApp: (app) => {
        // https://keystonejs.com/docs/apis/config#extend-express-app
    },
}
