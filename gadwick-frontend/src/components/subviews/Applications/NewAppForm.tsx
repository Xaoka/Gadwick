import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

interface INewAppForm
{
    onSubmit: (app: {name: string, description: string}) => void;
}

export default function NewAppForm(props: INewAppForm)
{
    const [appName, setAppName] = useState<string>("")
    const [appDescription, setAppDescription] = useState<string>("")

    function onSubmit(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        evt.preventDefault();
        evt.stopPropagation();
        props.onSubmit({ name: appName, description: appDescription });
    }
    
    return <>
        <TextField label="Application Name *" onChange={(evt) => setAppName(evt.target.value)} style={{ display: "block" }} autoFocus={true} />
        <TextField label="Description" onChange={(evt) => setAppDescription(evt.target.value)} style={{ display: "block" }} fullWidth={true}/>
        <div>
            <button disabled={appName.length === 0} onClick={onSubmit}>
                Submit
            </button>
        </div>
    </>
}