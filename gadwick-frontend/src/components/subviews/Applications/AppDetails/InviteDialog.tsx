import { Dialog, DialogTitle, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { Roles } from './UserRoles';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import { IConfiguredApplication } from '../AppView';
import VerifiedInput, { VerificationState } from '../../VerifiedInput';

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

    const roleDescriptions: { [role: string]: string[] } =
    {
        "Maintainer": ["Modify app settings", "Add, configure or remove features", "Run tests", "View analytics", "Add or remove users"],
        "Tester": ["View app settings", "View features", "Run tests", "View analytics"],
        "Guest": ["View app settings except secret keys", "View tests", "View features", "View analytics"]
    }

    function verifyEmail(emailString: string): VerificationState
    {
        if (emailString.length === 0)
        {
            return VerificationState.Pending;
        }
        else if (emailString.match(emailRegex))
        {
            return VerificationState.Verified;
        }
        else
        {
            return VerificationState.Failed;
        }
    }

    async function sendInvite()
    {
        await serverAPI(API.Invites, HTTP.CREATE, undefined, { app_id: props.app.id, invite_email: email, role: roleSelected })
        props.onSubmit();
    }
    
    // TODO: Prevent inviting existing collaborators
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
                <VerifiedInput label="Email" verification={verifyEmail} onTextChanged={setEmail}/>
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
                {roleDescriptions[roleSelected].map((permission) => <li key={permission}>{permission}</li>)}
            </ul>
            <div>
                <button className="danger" onClick={props.onClose}>Cancel</button>
                <button className="success" onClick={sendInvite} disabled={!email.match(emailRegex)}>Invite</button>
            </div>
        </div>
    </Dialog>
}