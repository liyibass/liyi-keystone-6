import React, { useState } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'
import HtmlDraftEditor from '@liyibass/html-draft-editor'
import DraftEditor from './Editor'

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    return (
        <FieldContainer>
            <div
                className="editorContainer"
                style={{
                    border: '1px solid #C1C7D0',
                    borderRadius: 6,
                    padding: '2px',
                }}
            >
                <FieldLabel field={field} errors={errors} />
                <FieldDescription text={field.adminDoc} />

                <HtmlDraftEditor
                    KeyStoneOnChange={onChange}
                    autoFocus={autoFocus}
                    field={field}
                    value={value}
                />
                {/* <DraftEditor value={value} onChange={onChange} /> */}
            </div>
        </FieldContainer>
    )
}

export default HtmlField
