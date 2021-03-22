import React, { useEffect, useState } from 'react';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import copyToClipboard from '../../../../utils/Clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { IConfiguredApplication } from '../AppView';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import getUserID from '../../../../apis/user';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteDialog from '../../../DeleteDialog';
import { Roles } from './UserRoles';
import { useSnackbarMessages } from '../../../snackbar/SnackbarContext';

interface ISettings
{
    app: IConfiguredApplication;
    permissionLevel: Roles;
    onSaved?: () => void; // TODO: Figure out how we want to propagate this event
}

export default function Settings(props: ISettings)
{
    const { user } = useAuth0();
    const snackbar = useSnackbarMessages();
    const history = useHistory();
    const [appName, setAppName] = useState<string>(props.app.name);
    const [appDescription, setAppDescription] = useState<string>(props.app.description);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [userID, setUserID] = useState<string|null>(null);

    // TODO: Change to upstream refresh
    const [clientSecretKey, setClientSecretKey] = useState(props.app.client_secret);

    useEffect(() => {
        getUserID(user.sub).then(setUserID);
    }, [])

    useEffect(() => {
        setHasChanges(appName !== props.app.name || appDescription !== props.app.description)
    }, [appName, appDescription])

    async function onSave()
    {
        serverAPI(API.Applications, HTTP.UPDATE, props.app.id, { name: appName, description: appDescription });
        if (props.onSaved)
        {
            props.onSaved();
        }
        snackbar?.sendSnackbarMessage(`Application settings saved`, "success");
    }

    function onLeave()
    {
        if (!userID)
        {
            console.warn(`Trying to leave app with no user ID.`);
            return;
        }
        if (!props.app.id)
        {
            console.warn(`Trying to leave app with no user ID.`);
            return;
        }
        serverAPI(API.AppRoles, HTTP.DELETE, props.app.id, { }, [{ pathKey: "users", value: userID }]);
        returnToAppsView();
        snackbar?.sendSnackbarMessage(`Application deleted`, "success");
    }

    function onAppDeleted()
    {
        setDeleteDialogOpen(false);
        serverAPI(API.Applications, HTTP.DELETE, props.app.id);
        returnToAppsView();
        snackbar?.sendSnackbarMessage(`Application deleted`, "success");
    }

    function returnToAppsView()
    {
        // TODO: This needs to refresh properly on leave!
        if (props.onSaved)
        {
            props.onSaved();
        }
        history.push(`/dashboard/applications`);
    }

    async function revokeToken()
    {
        const { client_secret } = await serverAPI<{client_secret: string}>(API.ApplicationsAPIKey, HTTP.CREATE, props.app.id);
        setClientSecretKey(client_secret);
        if (props.onSaved)
        {
            props.onSaved();
        }
        snackbar?.sendSnackbarMessage(`New app client secret generated`, "success");
    }

    const canEdit = props.permissionLevel === Roles.Admin || props.permissionLevel === Roles.Maintainer;

    return <>
        <h3>Details</h3>
        <TextField label="App Name" disabled={!canEdit} defaultValue={props.app.name} style={{ display: "block" }} onChange={(evt) => setAppName(evt.target.value)}/>
        <TextField label="Description" disabled={!canEdit} defaultValue={props.app.description} style={{ display: "block", width: "50%" }} fullWidth={true} onChange={(evt) => setAppDescription(evt.target.value)}/>
        <button onClick={onSave} disabled={!hasChanges||!canEdit}>Save</button>

        {props.permissionLevel !== Roles.Guest && <>
        <h3>Integrations</h3>
        <p>You can connect your test suite to Gadwick by using the Gadwick reporter and configuring it with your client secret for this app:</p>
        <Tooltip title="Revoke app secret and generate a new one.">
            <IconButton onClick={revokeToken}>
                <RefreshIcon/>
            </IconButton>
        </Tooltip>
        <input value={clientSecretKey} disabled style={{ width: 250 }}/>
        <Tooltip title="Copy client secret to clipboard">
            <IconButton onClick={() => copyToClipboard(clientSecretKey)}>
                <FileCopyIcon/>
            </IconButton>
        </Tooltip>
        </>}
        {props.permissionLevel !== Roles.Admin && <>
            <h3>Leave Application</h3>
            <p>By leaving this application you will no longer be able to see or modify it unless invited back.</p>
            <button className="danger" onClick={onLeave}>
                Leave
            </button>
        </>
        }
        {props.permissionLevel === Roles.Admin && <>
            <h3>Delete Application</h3>
            <p>Deleting this application will remove it for all users and cannot be undone.</p>
            <button className="danger" onClick={() => setDeleteDialogOpen(true)}>
                Delete
            </button>
            <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onSubmit={onAppDeleted} targetType="Application" deleteTargetText="the application, features and test results for all users."/>
        </>
        }
    </>
}