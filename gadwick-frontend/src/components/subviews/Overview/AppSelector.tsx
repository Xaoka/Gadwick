import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import user from '../../../apis/user';
import getUserID from '../../../apis/user';
import { IConfiguredApplication, IUserApps } from '../Applications/AppView';

interface IAppSelector
{
    onSelectionChanged?: (app: IConfiguredApplication) => void;
}

export default function AppSelector(props: IAppSelector)
{
    const { user } = useAuth0();
    const [apps, setApps] = useState<IConfiguredApplication[]>([]);
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null);

    useEffect(() => {
        if (appSelected == null) { return; }
        if (!props.onSelectionChanged) { return; }
        props.onSelectionChanged(appSelected);
    }, [appSelected])

    useEffect(() => {
        getUserID(user.sub).then((id) =>
        {
            if (!id) { return; }
            serverAPI<IUserApps>(API.ApplicationsForUser, HTTP.READ, id).then((apps) =>
            {
                setApps(apps.applications);
                setAppSelected(apps.applications[0]);
            });
        });
    }, [])

    
    return <div>
        <select name="app" onChange={(evt) => setAppSelected(apps[parseInt(evt.target.value)])}>
            {apps.map((app) => <option value={apps.indexOf(app)}>{app.name}</option>)}
        </select>
    </div>
}