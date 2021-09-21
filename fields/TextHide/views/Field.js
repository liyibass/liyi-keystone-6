import React, { useState } from 'react'
import {
    FieldContainer,
    FieldLabel,
    FieldDescription,
    FieldInput,
} from '@arch-ui/fields'

const TextHideField = (props) => {
    const { onChange, autoFocus, field, errors, value = '', isDisabled } = props

    const handleChange = (event) => {
        onChange(event.target.value)
    }
    const { isMultiline } = field.config
    const htmlID = `ks-input-${field.path}`
    const canRead = errors.every(
        (error) =>
            !(error instanceof Error && error.name === 'AccessDeniedError')
    )
    const error = errors.find(
        (error) => error instanceof Error && error.name === 'AccessDeniedError'
    )

    const showField = () => {
        // return { display: 'none' }
        return { display: 'block' }
    }

    const inputStyle = {
        width: '100%',
        outline: '0',
        padding: '8px 12px',
        border: '1px solid transparent',
        borderRadius: '6px',
        borderColor: '#DFE1E5',
        background: '#F4F5F7',
    }

    return (
        <FieldContainer className="text-hide-field" style={showField()}>
            <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
            <FieldDescription text={field.adminDoc} />
            <FieldInput>
                <input
                    style={inputStyle}
                    autoComplete="off"
                    autoFocus={autoFocus}
                    required={field.isRequired}
                    type="text"
                    value={canRead ? value : undefined}
                    placeholder={canRead ? undefined : error.message}
                    onChange={handleChange}
                    id={htmlID}
                    ismultiline={isMultiline}
                    disabled={isDisabled}
                />
            </FieldInput>
        </FieldContainer>
    )
}

export default TextHideField
