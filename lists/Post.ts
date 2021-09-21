import { list } from '@keystone-next/keystone'
import {
    text,
    relationship,
    timestamp,
    select,
} from '@keystone-next/keystone/fields'
import { document } from '@keystone-next/fields-document'
import { addTrackingFields } from '../utils/trackingHandler'

const listConfigurations = list({
    fields: {
        title: text(),
        status: select({
            options: [
                { label: 'Published', value: 'published' },
                { label: 'Draft', value: 'draft' },
            ],
            ui: {
                displayMode: 'segmented-control',
            },
        }),
        content: document({
            formatting: true,
            layouts: [
                [1, 1],
                [1, 1, 1],
                [2, 1],
                [1, 2],
                [1, 2, 1],
            ],
            links: true,
            dividers: true,
        }),
        publishDate: timestamp(),
    },
})

export default addTrackingFields(listConfigurations)
