import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import { IAppInvite } from './AppView';

interface IAcceptInviteDialog
{
    onClose: () => void;
    onAccept: () => void;
    onDecline: () => void;
    open: boolean;
    invite?: IAppInvite;
}

export default function AcceptInviteDialog(props: IAcceptInviteDialog)
{
    return <Dialog open={props.open} maxWidth="sm" onClose={props.onClose} id="new_app_dialog">
            <DialogTitle style={{ paddingLeft: 40, paddingRight: 40 }}>
                <h3>
                    Application Invite
                    <IconButton style={{float: "right"}} onClick={props.onClose}><CloseIcon/></IconButton>
                </h3>
            </DialogTitle>
            <div style={{ paddingLeft: 40, paddingRight: 40 }}>
                <p>You've been invited to collaborate on {props.invite?.name}!</p>
                <div>
                    <button className="danger" onClick={props.onDecline}>Decline</button>
                    <button className="success" onClick={props.onAccept}>Accept</button>
                </div>
            </div>
        </Dialog>
}