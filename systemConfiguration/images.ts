import type { ImagesConfig } from '@keystone-next/keystone/types'
// https://keystonejs.com/docs/apis/config#files

export const images: ImagesConfig = {
    upload: 'local',
    local: {
        storagePath: 'public/images',
        baseUrl: '/images',
    },
}
