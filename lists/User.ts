import { list } from '@keystone-next/keystone'
import {
    text,
    password,
    timestamp,
    select,
} from '@keystone-next/keystone/fields'

import { addTrackingFields } from '../utils/trackingHandler'

const listConfigurations = list({
    ui: {
        listView: {
            initialColumns: ['name'],
        },
    },
    fields: {
        name: text({ isRequired: true }),
        email: text({
            isRequired: true,
            isIndexed: 'unique',
            isFilterable: true,
        }),
        password: password({ isRequired: true }),
        role: select({
            label: '狀態',
            dataType: 'enum',
            options: [
                { label: 'admin', value: 'admin' },
                { label: 'editor', value: 'editor' },
                { label: 'apiGateway', value: 'apiGateway' },
            ],
        }),
        lastLogin: timestamp({
            label: '最後登入時間',
            // adminDoc: '起始時間',
        }),
    },
})

export default addTrackingFields(listConfigurations)
