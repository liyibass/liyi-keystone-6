import { relationship, timestamp } from '@keystone-next/keystone/fields'

/**
add additional fields and hooks into existed list.
hooks: fill data into fields after save .
@param {object} list
@return {object} list
*/
export function addTrackingFields(list) {
    // list's original hooks.resolveInput came from list
    const originalResolveInput = list.hooks?.resolveInput

    // custom hooks.resolveInput
    const newResolveInput = ({ resolvedData, existingItem, context }) => {
        // fill additional fields with corresponding data
        fillAtTrackingField(resolvedData, existingItem)

        const currentUserId = parseInt(context.session?.itemId)
        if (!currentUserId) return resolvedData

        fillByTrackingField(currentUserId, resolvedData, existingItem)
        return resolvedData
    }

    // add additional fields
    list.fields.createdAt = timestamp({
        label: '建立時間',
        ui: {
            createView: { fieldMode: 'hidden' },
            itemView: { fieldMode: 'read' },
        },
    })
    list.fields.updatedAt = timestamp({
        label: '更新時間',
        ui: {
            createView: { fieldMode: 'hidden' },
            itemView: { fieldMode: 'read' },
        },
    })
    list.fields.createdBy = relationship({
        label: '建立者',
        ref: 'User',
        ui: {
            createView: { fieldMode: 'hidden' },
            itemView: { fieldMode: 'read' },
        },
    })
    list.fields.updatedBy = relationship({
        label: '更新者',
        ref: 'User',
        ui: {
            createView: { fieldMode: 'hidden' },
            itemView: { fieldMode: 'read' },
        },
    })

    // add custom hooks
    // combine the original hook and the custom one
    list.hooks = {
        ...list.hooks,
        resolveInput: combineTwoHook(originalResolveInput, newResolveInput),
    }

    return list
}
/** 
combine two lifecycle functions(ex. resolveInput) in hooks
 * @param {function} originalHook
 * @param {function} newHook
 * @return {function} combinedHook
*/
function combineTwoHook(originalHook, newHook) {
    // params is came from hooks : resolvedData, existingItem...etc
    return async (params) => {
        let { resolvedData } = params

        if (originalHook) {
            resolvedData = await originalHook(params)
        }
        return newHook({ ...params, resolvedData })
    }
}

/**
 * Fill relationship's connect data (UserId) into field,
 * if it's in create mode, put data into 'createdBy' field;
 * if it's in update mode, then put data into 'updatedBy' field.
 * @param {object} resolvedData
 * @param {object} existingItem
 */
function fillByTrackingField(currentUserId, resolvedData, existingItem) {
    const relationshipData = { connect: { id: currentUserId } }

    // Note:
    // Although we'll put relationshipData into fields named "createdBy"/"updatedBy",
    // after saved data into db,
    // keystone 6 will do some 'magic-and-weird' process,
    // and then change field name to "created_byId"/"updated_byId"
    // (we can find that via console.log(existingItem))
    // (that process won't affect field view in admin-ui)

    // so if we want to check byTracking's value,
    // we need to use key name "created_byId"/"updated_byId" instead of "createdBy"/"updatedBy"
    if (existingItem && existingItem['createdById']) {
        // update mode
        resolvedData['updatedBy'] = relationshipData
    } else {
        // create mode
        if (currentUserId) {
            resolvedData['createdBy'] = relationshipData
        }
    }
}

/**
 * Fill Date object into field,
 * if it's in create mode, put created time into 'createdAt' field;
 * if it's in update mode, then put updated time into 'updatedAt' field.
 * @param {object} resolvedData
 * @param {object} existingItem
 */
function fillAtTrackingField(resolvedData, existingItem) {
    if (existingItem && existingItem['createdAt']) {
        // update mode
        resolvedData['updatedAt'] = new Date()
    } else {
        // create mode
        resolvedData['createdAt'] = new Date()
    }
}
