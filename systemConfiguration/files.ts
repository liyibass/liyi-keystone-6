import type { FilesConfig } from '@keystone-next/keystone/types'
// https://keystonejs.com/docs/apis/config#files

export const files: FilesConfig = {
    upload: 'local',
    local: {
        storagePath: 'public/files',
        baseUrl: '/files',
    },
}
