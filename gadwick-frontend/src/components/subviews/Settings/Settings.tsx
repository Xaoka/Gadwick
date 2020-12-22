import { useAuth0 } from '@auth0/auth0-react';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID, { IUser } from '../../../apis/user';
import SubView from '../SubView';

export default function Settings()
{
    const { user } = useAuth0();
    const [gadwickUser, setGadwickUser] = useState<IUser|null>(null);

    useEffect(() => {
        getUserID(user.sub).then((id: string|null) =>
        {
            if (!id) { return; }
            serverAPI<IUser>(API.Users, HTTP.READ, id).then(setGadwickUser);
        });
    }, [])

    return <SubView title="Settings">
        <h2>Account Settings</h2>
        <p>
            Configure your account settings.
        </p>
        <TextField defaultValue={gadwickUser?.name} label="Name"/>
        {/** Icon? */}
        <div>
            <button>Save</button>
        </div>
    </SubView>
}