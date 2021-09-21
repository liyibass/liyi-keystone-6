import React from 'react'
import { TextInput } from '@keystone-ui/fields'

type NewDatetimeProps = {
    value: string | undefined
    onChange?: (value: string | undefined) => void
    autoFocus?: boolean
    hasNowButton?: boolean
}

export function NewDatetime(props: NewDatetimeProps) {
    const { value, onChange, autoFocus } = props

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value)
        }
    }
    return (
        <TextInput
            autoFocus={autoFocus}
            type="text"
            value={value}
            onChange={(e) => changeHandler(e)}
        />
    )
}
