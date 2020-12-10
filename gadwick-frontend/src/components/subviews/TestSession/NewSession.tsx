import { useAuth0 } from '@auth0/auth0-react';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import BreadcrumbPath from '../../BreadcrumbPath';
import InfoCard, { MediaType } from '../../InfoCard';
import { IConfiguredApplication } from '../Applications/AppView';
import { IFeature } from '../Features/Features';
import { ISession } from './Overview';

enum State { App, Features }

interface INewSession
{
    sessionURL: string;
}

export default function NewSession(props: INewSession)
{
    const { user } = useAuth0();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [configuredApplications, setConfiguredApplications] = useState<IConfiguredApplication[]>([]);
    const [state, setState] = useState<State>(State.App)
    
    useEffect(() => {
        setIsLoading(true);
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.READ, user_id).then((apps) =>
            {
                setConfiguredApplications(apps)
                setIsLoading(false);
            });
        })
    }, []);
    function onAppSelected(app: IConfiguredApplication)
    {
        // setState(State.Features);
        // TODO: Possibly allow the user to only test new/old or specific features
        // TODO: Select app version (And infer this?)
        onSessionStarted(app);
    }

    function onSessionStarted(app: IConfiguredApplication)
    {
        // TODO: make userID a hook?! Or cache?
        getUserID(user.sub).then(async (user_id) =>
        {
            const features = await serverAPI<IFeature[]>(API.Features, HTTP.READ, app.id);
            const feature_ids = JSON.stringify(features.map((f) => f.id));
            const response = await serverAPI<ISession>(API.Sessions, HTTP.CREATE, undefined, { user_id, app_version: "0.0.0", app_id: app.id, feature_ids });
            history.push(`${props.sessionURL}/${response.id}`);
        });
    }

    function renderSkeletons()
    {
        let skeletons = [];
        for (let i = 0; i < 5; i++)
        {
            const skeleton = <Skeleton style={{ display: "inline-block", margin: 10 }}>
                <InfoCard image={MediaType.Application} title={"App"} summary="My app description goes here" key={`Skeleton${i}`}/>
            </Skeleton>
            skeletons.push(skeleton)
        }
        return skeletons;
    }
    return <>
        {state == State.App && <>
            <p>Choose which app you would like to test:</p>
            {isLoading && renderSkeletons()}
            {!isLoading && configuredApplications.map((app) =>
                <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => onAppSelected(app)}/>
            )}
            {!isLoading && configuredApplications.length === 0 && <p>You have no apps configured, you'll need to make one first.</p>}
        </>}
    </>
}