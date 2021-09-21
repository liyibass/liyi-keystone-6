import React from 'react'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import {
    CellLink,
    CellContainer,
} from '@keystone-next/keystone/admin-ui/components'

import {
    CardValueComponent,
    CellComponent,
    FieldController,
    FieldControllerConfig,
    FieldProps,
} from '@keystone-next/types'
import { NewDatetime } from './newDateTime'

// this is the component shown in the create modal and item page
export const Field = ({
    field,
    value,
    onChange,
    autoFocus,
}: FieldProps<typeof controller>) => {
    console.log(field)
    const { label, hasNowButton } = field
    return (
        <FieldContainer as="fieldset">
            <FieldLabel as="legend">{label}</FieldLabel>
            <NewDatetime
                onChange={onChange}
                value={value}
                autoFocus={autoFocus}
                hasNowButton={hasNowButton}
            />
        </FieldContainer>
    )
}

// this is shown on the list view in the table
export const Cell: CellComponent = ({ item, field, linkTo }) => {
    let value = item[field.path] + ''
    return linkTo ? (
        <CellLink {...linkTo}>{value}</CellLink>
    ) : (
        <CellContainer>{value}</CellContainer>
    )
}
// setting supportsLinksTo means the cell component allows containing a link to the item
// for example, text fields support it but relationship fields don't because
// their cell component links to the related item so it can't link to the item that the relationship is on
Cell.supportsLinkTo = true

// this is shown on the item page in relationship fields with `displayMode: 'cards'`
export const CardValue: CardValueComponent = ({ item, field }) => {
    return (
        <FieldContainer>
            <FieldLabel>{field.label}</FieldLabel>
            {item[field.path]}
        </FieldContainer>
    )
}

export const controller = (
    // the type parameter here needs to align with what is returned from `getAdminMeta`
    // in the server-side portion of the field type
    config: FieldControllerConfig<{ hasNowButton: boolean }>
): FieldController<string | undefined, string> & { hasNowButton: boolean } => {
    return {
        hasNowButton: config.fieldMeta.hasNowButton,
        path: config.path,
        label: config.label,
        graphqlSelection: config.path,
        defaultValue: undefined,
        deserialize: (data) => {
            const value = data[config.path]

            return typeof value === 'string' ? value : undefined
        },
        serialize: (value) => {
            return { [config.path]: value }
        },
    }
}
