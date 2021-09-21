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
        name: text({
            label: '標題',
            isRequired: true,
        }),
    },
})

export default addTrackingFields(listConfigurations)
