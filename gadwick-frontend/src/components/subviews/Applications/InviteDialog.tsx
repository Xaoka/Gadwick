import { Dialog, DialogTitle, IconButton, SvgIconTypeMap, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Roles } from './UserRoles';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { IConfiguredApplication } from './AppView';

interface IInviteDialog
{
    open: boolean;
    app: IConfiguredApplication;
    onClose: () => void;
    onSubmit: () => void;
}

const emailRegex = /^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

export default function InviteDialog(props: IInviteDialog)
{
    const [roleSelected, setRoleSelected] = useState<string>(Roles.Maintainer);
    const [email, setEmail] = useState<string>("");
    const [EmailIcon, setEmailIcon] = useState<OverridableComponent<SvgIconTypeMap>>(RadioButtonUncheckedIcon);

    const roleDescriptions: { [role: string]: string[] } =
    {
        "Maintainer": ["Modify app settings", "Add, configure or remove features", "Run tests", "View analytics"],
        "Tester": ["View app settings", "View features", "Run tests", "View analytics"],
        "Guest": ["View tests", "View analytics"]
    }

    useEffect(() => {
        if (email.length === 0)
        {
            setEmailIcon(RadioButtonUncheckedIcon);
        }
        else if (email.match(emailRegex))
        {
            setEmailIcon(CheckCircleIcon);
        }
        else
        {
            setEmailIcon(HighlightOffIcon);
        }

    }, [email])

    async function sendInvite()
    {
        await serverAPI(API.Invites, HTTP.CREATE, undefined, { app_id: props.app.id, invite_email: email, role: roleSelected })
        props.onSubmit();
    }
    
    return <Dialog open={props.open} maxWidth="sm" fullWidth={true} onClose={props.onClose} id="new_app_dialog">
        <DialogTitle style={{ padding: 40, paddingBottom: 0, paddingTop: 0 }}>
            <h3>
                Send Invite
                <IconButton style={{float: "right"}} onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </h3>
        </DialogTitle>
        <div style={{ padding: 40, paddingTop: 0}}>
            <div style={{ paddingBottom: 10 }}>
                <span style={{verticalAlign: "bottom"}}>Send invite to</span>
                <TextField label="Email" style={{ marginLeft: 10 }} onChange={(evt) => setEmail(evt.target.value)}/>
                <EmailIcon fontSize="small" style={{ marginRight: 10, verticalAlign: "bottom", paddingBottom: 5 }}/>
                <span style={{verticalAlign: "bottom"}}>
                    for role:
                    <select onChange={(evt) => setRoleSelected(evt.target.value)} style={{ marginLeft: 10 }}>
                        <option value={Roles.Maintainer}>Maintainer</option>
                        <option value={Roles.Tester}>Tester</option>
                        <option value={Roles.Guest}>Guest</option>
                    </select>
                </span>
            </div>
            <p>An invite will be shown in the app view to the user with this email address if they exist.</p>
            <p>Users with this permission level will be able to:</p>
            <ul>
                {roleDescriptions[roleSelected].map((permission) => <li>{permission}</li>)}
            </ul>
            <div>
                <button className="danger" onClick={props.onClose}>Cancel</button>
                <button className="success" onClick={sendInvite} disabled={!email.match(emailRegex)}>Invite</button>
            </div>
        </div>
    </Dialog>
}