import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'

interface IDeleteApplicationDialog
{
    onClose: () => void;
    onSubmit: () => void;
    open: boolean;
}

export default function DeleteApplicationDialog(props: IDeleteApplicationDialog)
{
    // TODO: Ensure the app name is unique to the user
    return <Dialog open={props.open} maxWidth="sm" onClose={props.onClose} id="new_app_dialog">
            <DialogTitle style={{ padding: 40, paddingBottom: 0 }}>
                <span className="heading">Delete Application</span>
                <IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton>
            </DialogTitle>
            <div style={{ padding: 40, paddingTop: 0 }}>
                Deleting this application <b>cannot be undone</b> and will delete all features and test results associated with it. Are you sure you wish to continue?
                <div style={{ paddingTop: 20 }}>
                    <button onClick={props.onClose}>Cancel</button>
                    <button onClick={props.onSubmit} className="danger">Delete</button>
                </div>
            </div>
        </Dialog>
}