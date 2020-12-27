import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton, Input, InputLabel, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'

interface INewApplicationDialog
{
    onClose: () => void;
    onSubmit: (data: { name: string, description: string }) => void;
    open: boolean;
}

export default function NewApplicationDialog(props: INewApplicationDialog)
{
    const [appName, setAppName] = useState<string>("")
    const [appDescription, setAppDescription] = useState<string>("")

    function onSubmit(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        evt.preventDefault();
        evt.stopPropagation();
        props.onSubmit({ name: appName, description: appDescription });
    }

    return <Dialog open={props.open} maxWidth="sm" onClose={props.onClose} id="new_app_dialog">
            <DialogTitle style={{ padding: 40, paddingBottom: 0 }}>
                <h3>
                    New Application
                <IconButton style={{float: "right"}} onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
                </h3>
            </DialogTitle>
            <div style={{ padding: 40, paddingTop: 0 }}>
                <p>An application represents your product and allows you to track testing data on a per-product basis.</p>
                <TextField label="Application Name *" onChange={(evt) => setAppName(evt.target.value)} style={{ display: "block" }} autoFocus={true} />
                <TextField label="Description" onChange={(evt) => setAppDescription(evt.target.value)} style={{ display: "block" }} fullWidth={true}/>
                <div>
                    <button disabled={appName.length === 0} onClick={onSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </Dialog>
}