import { list } from '@keystone-next/keystone'
import {
    text,
    relationship,
    timestamp,
    select,
} from '@keystone-next/keystone/fields'
import { document } from '@keystone-next/fields-document'
import { addTrackingFields } from '../utils/trackingHandler'
import { NewDatetime } from '../custom-fields'

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
        newDateTime: NewDatetime({
            label: 'NewDateTime',
            hasNowButton: false, // default to false
            hasTimePicker: true, // default to true
            isReadOnly: false, // default to false
        }),
    },
})

export default addTrackingFields(listConfigurations)
