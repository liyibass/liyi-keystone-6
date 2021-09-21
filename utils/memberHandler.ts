import type { KeystoneContext } from '@keystone-next/types'
import MemberMutation from './memberMutation'
export const mutationIsCameFromOtherList = (context: KeystoneContext) => {
    return context.req.headers['request-from'] === 'gql'
}

export const getPrevMemberRelationshipData = async (
    memberId: number | null
) => {
    if (!memberId)
        // no memberId => create mode,
        // just return all false
        return {
            existedMarketingMembership: false,
            existedSubscription: false,
        }

    try {
        // NOTE:
        // We need to get member's all relationship data in stored in db
        // However we can't get them via existingItem
        // ( because of two-way relationship's structure )
        // So the only thing we can do here is fire a query request to member itself
        // and get it's relationship data
        // (maybe keystone 6 will fix this weird behavior in the future)

        const memberMutation = new MemberMutation(memberId, true)
        const result = await memberMutation.getMemberRelationship()
        const {
            marketingMembership: existedMarketingMembership,
            subscription: existedSubscription,
        } = result?.member

        return {
            existedMarketingMembership,
            existedSubscription,
        }
    } catch (error) {
        return {
            existedMarketingMembership: false,
            existedSubscription: false,
        }
    }
}

export const hasValueInRelationship = (
    field: Record<string, any>,
    existedField: Record<string, any>,
    isToManyRelationship?: boolean
) => {
    let notCleared: boolean
    let hasNewValue: boolean
    let alreadyHasValue: boolean

    if (isToManyRelationship) {
        // one-to-many
        notCleared = !field?.disconnect?.length
        hasNewValue = !!field?.connect?.length
        alreadyHasValue = !!existedField?.length
    } else {
        // one-to-one
        notCleared = !(field?.disconnect === true)
        hasNewValue = !!field?.connect
        alreadyHasValue = !!existedField
    }
    return notCleared && (hasNewValue || alreadyHasValue)
}
