import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import NewAppForm from './NewAppForm';

interface INewApplicationDialog
{
    onClose: () => void;
    onSubmit: (data: { name: string, description: string }) => void;
    open: boolean;
}

export default function NewApplicationDialog(props: INewApplicationDialog)
{

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
            <NewAppForm onSubmit={props.onSubmit}/>
        </div>
    </Dialog>
}