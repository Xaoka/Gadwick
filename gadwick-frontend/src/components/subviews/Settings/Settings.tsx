import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, TextField } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID, { IUser } from '../../../apis/user';
import SubView from '../SubView';
import CopyButton from '../../CopyButton';

export default function Settings()
{
    const { user } = useAuth0();
    const [gadwickUser, setGadwickUser] = useState<IUser|null>(null);
    const [newName, setNewName] = useState<string>("");
    const [APIKey, setAPIKey] = useState<string>("");

    useEffect(refreshUser, [])

    function refreshUser()
    {
        getUserID(user.sub).then((id: string|null) =>
        {
            if (!id) { return; }
            serverAPI<IUser>(API.Users, HTTP.READ, id).then(setGadwickUser);
        });
    }

    useEffect(() => {
        if (!gadwickUser) { return; }
        setNewName(gadwickUser.name);
    }, [gadwickUser])

    async function onSaved()
    {
        await serverAPI(API.Users, HTTP.UPDATE, gadwickUser?.id, { name: newName })
        refreshUser();
    }

    async function getNewAPIKey()
    {
        const {api_key} = await serverAPI(API.UserAPIKey, HTTP.CREATE, gadwickUser?.id);
        setAPIKey(api_key);
    }

    return <SubView title="Settings">
        <h2>Account Settings</h2>
        <p>
            Configure your account settings.
        </p>
        {/* <EditableText text={gadwickUser?.name||""} editIcon={true} onChanged={setNewName} label="Name: "/> */}
        {gadwickUser && <TextField label="Name" defaultValue={gadwickUser?.name} onChange={(evt) => setNewName(evt.target.value)}/>}
        {!gadwickUser && <Skeleton><TextField label="Name" defaultValue={""}/></Skeleton>}
        <div>
            <button onClick={onSaved} disabled={!gadwickUser || gadwickUser.name === newName}>Save</button>
        </div>
        <h2>API Keys</h2>
        <Alert severity="warning">Requesting a new key will revoke the old one and may disable integrations that relied on it.</Alert>
        <p>API keys are used to allow integrations to manage your applications and submit test results. <b>Do not share these with anyone.</b></p>
        { APIKey.length === 0 && <button onClick={getNewAPIKey}>Get new key</button>}
        { APIKey.length > 0 && <>
            <p>For security reasons this will only be shown to you once. You should make note of it securely.</p>
            <p>{APIKey}<CopyButton textToCopy={APIKey}/></p>
        </>}
        <h2>Terms & Conditions</h2>
        The terms and conditions for using Gadwick services are detailed in our <a href="/privacy-policy">Privacy Policy</a>.
    </SubView>
}