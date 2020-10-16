import React, { useState } from 'react';

export interface IEditableText
{
    text: string;
    onChanged: (text: string) => void;
}

export default function EditableText(props: IEditableText)
{
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(props.text);
    const [inputText, setInputText] = useState(props.text);

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
        return <div onClick={startEdit}>{text}</div>
    }
}