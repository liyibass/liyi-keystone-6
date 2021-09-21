import { list } from '@keystone-next/keystone'
import {
    text,
    relationship,
    timestamp,
    select,
} from '@keystone-next/keystone/fields'
import { document } from '@keystone-next/fields-document'
import { addTrackingFields } from '../utils/trackingHandler'
import { NewDatetime } from '../customFields'

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
        newDateTime1: NewDatetime({
            label: 'NewDateTime:default',
        }),
        newDateTime2: NewDatetime({
            label: 'NewDateTime:Now Button',
            hasNowButton: true, // default to false
        }),
        newDateTime3: NewDatetime({
            label: 'NewDateTime:No time',
            hasTimePicker: false, // default to true
        }),
        newDateTime4: NewDatetime({
            label: 'NewDateTime: read only',
            hasNowButton: true, // default to false
        }),
    },
})

export default addTrackingFields(listConfigurations)
