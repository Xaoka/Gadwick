import { IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';

export interface IEditableText
{
    text: string;
    label?: string;
    onChanged: (text: string) => void;
    editIcon?: boolean;
}

export default function EditableText(props: IEditableText)
{
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(props.text);
    const [inputText, setInputText] = useState(props.text);

    useEffect(() => {
        setText(props.text);
        setInputText(props.text);
    }, [props.text])

    function startEdit()
    {
        setEditing(true)
    }

    function stopEdit()
    {
        setEditing(false);
        setText(inputText);
        props.onChanged(inputText);
    }

    if (editing)
    {
        return <input onBlur={stopEdit} defaultValue={text} autoFocus={true} onChange={(event) => setInputText(event.target.value)}/>;
    }
    else
    {
        return <>
            {props.label}
            <span onClick={startEdit}>
                {text}
                {props.editIcon && <IconButton><EditIcon/></IconButton>}
            </span>
        </>
    }
}