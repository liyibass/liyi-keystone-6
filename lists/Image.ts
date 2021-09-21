import { list } from '@keystone-next/keystone'
import {
    text,
    relationship,
    timestamp,
    select,
    file,
    image,
    checkbox,
} from '@keystone-next/keystone/fields'
import { document } from '@keystone-next/fields-document'
import { addTrackingFields } from '../utils/trackingHandler'
import { NewDatetime } from '../custom-fields'
import {
    uploadFileHandler,
    deleteFileHandler,
} from '../utils/uploadFileHandler'

const listConfigurations = list({
    fields: {
        name: text({
            label: '標題',
            isRequired: true,
        }),
        file: image({}),
        needWatermark: checkbox({
            defaultValue: true,
        }),
    },
    hooks: {
        beforeChange: ({ resolvedData, existingItem, operation }) => {
            uploadFileHandler(resolvedData, existingItem, operation)
        },
        beforeDelete: ({ existingItem, operation }) => {
            deleteFileHandler(existingItem)
        },
    },
})

export default addTrackingFields(listConfigurations)
