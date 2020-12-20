import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'

interface IDeleteDialog
{
    onClose: () => void;
    onSubmit: () => void;
    open: boolean;
    targetType: string;
    /** Text describing what will be deleted ("Will delete [text] Are you sure?")*/
    deleteTargetText: string;
}

export default function DeleteDialog(props: IDeleteDialog)
{
    // TODO: Ensure the app name is unique to the user
    return <Dialog open={props.open} maxWidth="sm" onClose={props.onClose} id="new_app_dialog">
            <DialogTitle style={{ padding: 40, paddingBottom: 0 }}>
                <h3>Delete {props.targetType}<IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton></h3>
            </DialogTitle>
            <div style={{ padding: 40, paddingTop: 0 }}>
                Deleting this {props.targetType.toLocaleLowerCase()} <b>cannot be undone</b> and will delete {props.deleteTargetText} Are you sure you wish to continue?
                <div style={{ paddingTop: 20 }}>
                    <button onClick={props.onClose}>Cancel</button>
                    <button onClick={props.onSubmit} className="danger">Delete</button>
                </div>
            </div>
        </Dialog>
}