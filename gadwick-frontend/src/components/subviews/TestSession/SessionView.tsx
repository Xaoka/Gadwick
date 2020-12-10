import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import PrivateRoute from '../../PrivateRoute';
import NewSession from './NewSession';
import { ISession, ISessionResponse } from './Overview';

interface ISessionView
{
    onAbandon: () => void;
}

export default function SessionView(props: ISessionView)
{
    const { user } = useAuth0();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    let match = useRouteMatch<{sessionID: string}>({
      path: `${path}/:sessionID`
    })
    const [session, setSession] = useState<ISession|null>(null)

    useEffect(() =>
    {
        if (!match) { return; }
        serverAPI<ISessionResponse[]>(API.Sessions, HTTP.READ, match?.params.sessionID).then((s) =>
        {
            const sessionData: ISession =
            {
                ...s[0],
                feature_ids: JSON.parse(s[0].feature_ids)
            }
            setSession(sessionData);
        });
    }, [])
    
    async function onAbandon()
    {
        await serverAPI<ISession>(API.Sessions, HTTP.UPDATE, match?.params.sessionID, { status: "ABANDONED" })
        props.onAbandon();
    }

    return <>
        <p>This is your active session for {session?.appName}.</p>
        <button onClick={onAbandon}>Abandon</button>
    </>
}