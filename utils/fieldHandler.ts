export function fieldIsEmpty(
    item: { [path: string]: any; id: string | number },
    fieldName: string,
    isRelationship: boolean
) {
    const fieldKey = isRelationship ? `${fieldName}Id` : fieldName

    // return truthy/falsy
    return !!item[fieldKey]
}
