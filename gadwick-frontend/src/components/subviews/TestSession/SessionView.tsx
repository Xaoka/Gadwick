import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import PrivateRoute from '../../PrivateRoute';
import { IFeature } from '../Features/Features';
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
    const [features, setFeatures] = useState<IFeature[]>([])

    useEffect(() =>
    {
        if (!match) { return; }
        serverAPI<ISessionResponse[]>(API.Sessions, HTTP.READ, match?.params.sessionID).then((s) =>
        {
            const feature_ids: string[] = JSON.parse(s[0].feature_ids);
            const sessionData: ISession =
            {
                ...s[0],
                feature_ids
            }
            setSession(sessionData);
            serverAPI<IFeature[]>(API.Features, HTTP.READ, `?ids=${feature_ids.join(",")}`).then(setFeatures);
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
        {features.length === 0 && <div>Loading</div>}
        {features.length > 0 && <>
            <h2>{features[0].name}</h2>
            <p className="info">{features[0].description}</p>
            Follow the test steps detailed below, then mark the test as failed or completed.
        </>
        }
        {/** Track if this feature is complete for this session */}

    </>
}