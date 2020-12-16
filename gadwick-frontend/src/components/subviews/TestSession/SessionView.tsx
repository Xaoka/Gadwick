import { useAuth0 } from '@auth0/auth0-react';
import { List, ListItem } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import PrivateRoute from '../../PrivateRoute';
import { IFeature } from '../Features/Features';
import NewSession from './NewSession';
import { ISession, ISessionResponse } from './Overview';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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
    const [stepIndex, setStepIndex] = useState<number>(0);

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
            serverAPI<IFeature[]>(API.Features, HTTP.READ, `?ids=${feature_ids.join(",")}`).then((features) =>
            {
                features.forEach((f) => f.steps = JSON.parse(f.steps as any));
                setFeatures(features)
                setStepIndex(0);
            });
        });
    }, [])
    
    async function onAbandon()
    {
        await serverAPI<ISession>(API.Sessions, HTTP.UPDATE, match?.params.sessionID, { status: "ABANDONED" })
        props.onAbandon();
    }

    function checklistItem(step: string, index: number)
    {
        let backgroundColor = "lightgrey";
        if (index === stepIndex) { backgroundColor = "lightblue"; }
        if (index < stepIndex) { backgroundColor = "green"; }
        const onClick = (index === stepIndex) ? () => setStepIndex(stepIndex+1) : undefined;
        let color = (index > stepIndex) ? "black" : "white";

        return <ListItem button={false} style={{ padding: 15, backgroundColor }} onClick={onClick}>
            <span style={{width: "100%", color}}>
                {step}
                <CheckCircleIcon style={{ float: "right", color: "var(--theme-primary)" }} />
            </span>
        </ListItem>
    }

    return <>
        <p>This is your active session for {session?.appName}.</p>
        <button onClick={onAbandon}>Abandon</button>
        {features.length === 0 && <div>Loading</div>}
        {features.length > 0 && <>
            <h2>{features[0].name}</h2>
            <p className="info">{features[0].description}</p>
            Follow the test steps detailed below, then mark the test as failed or completed.
            <List component="nav" style={{ width: "80%" }}>
                {features[0].steps.map(checklistItem)}
            </List>
        </>
        }
        {/** Track if this feature is complete for this session */}

    </>
}