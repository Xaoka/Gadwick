import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'

interface INewApplicationDialog
{
    onClose: () => void;
    onSubmit: (data: any) => void;
    open: boolean;
}

export default function NewApplicationDialog(props: INewApplicationDialog)
{
    // TODO: Ensure the app name is unique to the user
    return <Dialog open={props.open} maxWidth="md" onClose={props.onClose} id="new_app_dialog">
            <DialogTitle style={{ padding: 40, paddingBottom: 0 }}>
                <span className="heading">New Application</span>
                <IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton>
            </DialogTitle>
            Create a new application, these represent your products and allow you to track testing data on a per-product basis.
            <form onSubmit={props.onSubmit} style={{ padding: 40 }}>
                <input defaultValue="My App" key="name"/><button>Submit</button>
            </form>
        </Dialog>
}