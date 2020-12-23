import React, { useEffect, useState } from 'react';
import CategoryIcon from '@material-ui/icons/Category';
import { Card, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Tooltip } from '@material-ui/core';
import copyToClipboard from '../../../../utils/Clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { IConfiguredApplication } from '../AppView';
import serverAPI, { API, HTTP } from '../../../../apis/api';

interface ISettings
{
    app: IConfiguredApplication;
    onSaved?: () => void; // TODO: Figure out how we want to propagate this event
}

export default function Settings(props: ISettings)
{
    const [appName, setAppName] = useState<string>(props.app.name);
    const [appDescription, setAppDescription] = useState<string>(props.app.description);
    const [hasChanges, setHasChanges] = useState<boolean>(false);

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
    }

    return <>
        <h3>Details</h3>
        <TextField label="App Name" defaultValue={props.app.name} style={{ display: "block" }} onChange={(evt) => setAppName(evt.target.value)}/>
        <TextField label="Description" defaultValue={props.app.description} style={{ display: "block", width: "50%" }} fullWidth={true} onChange={(evt) => setAppDescription(evt.target.value)}/>
        <button onClick={onSave} disabled={!hasChanges}>Save</button>

        <h3>Integrations</h3>
        <p>You can connect your test suite to Gadwick by using the Gadwick reporter and configuring it with your client secret for this app:</p>
        <input defaultValue={props.app.client_secret} disabled style={{ width: 250 }}/>
        <Tooltip title="Copy client secret to clipboard">
            <IconButton onClick={() => copyToClipboard(props.app.client_secret)}>
                <FileCopyIcon/>
            </IconButton>
        </Tooltip>
        {/** TODO: Allow for customisation of icon/colours? */}
    </>
}