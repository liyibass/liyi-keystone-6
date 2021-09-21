import type { AdminUIConfig } from '@keystone-next/keystone/types'

export const ui: AdminUIConfig = {
    isAccessAllowed: (context) => !!context.session?.data,
}
