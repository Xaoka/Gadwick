import { useAuth0 } from '@auth0/auth0-react';
import { TextField } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState, version } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
// import BreadcrumbPath from '../../BreadcrumbPath';
import InfoCard, { MediaType } from '../../InfoCard';
import { Roles } from '../Applications/AppDetails/UserRoles';
import { IConfiguredApplication, IUserApps } from '../Applications/AppView';
import { IFeature } from '../Features/Features';
import NotAvailable, { NotAvailableReason } from '../NotAvailable';
import { ISession } from './Overview';

enum State { App, Features }
export enum TestType
{
    Integration = "INTEGRATION",
    Regression = "REGRESSION"
}

interface INewSession
{
    sessionURL: string;
}

export default function NewSession(props: INewSession)
{
    const { user } = useAuth0();
    // let { path, url } = useRouteMatch();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [configuredApplications, setConfiguredApplications] = useState<IUserApps>({ applications: [], invites: [], shared: [] });
    const [state, setState] = useState<State>(State.App)
    const [appSelected, setAppSelected] = useState<IConfiguredApplication|null>(null);
    const [versions, setVersions] = useState<{version: string}[]>([]);
    const [versionSelected, setVersionSelected] = useState<string>("new");
    const [sessionVersion, setSessionVersion] = useState<string>("0.0.0");
    
    useEffect(() => {
        setIsLoading(true);
        getUserID(user.sub).then((user_id) =>
        {
            if (!user_id) { return; }
            serverAPI<IUserApps>(API.ApplicationsForUser, HTTP.READ, user_id).then((apps) =>
            {
                setConfiguredApplications(apps)
                setIsLoading(false);
            });
        })
    }, []);
    function onAppSelected(app: IConfiguredApplication)
    {
        serverAPI<{version: string}[]>(API.ApplicationsForUser, HTTP.READ, app.id).then(setVersions);
        setAppSelected(app);
        setState(State.Features);
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

    function setVersion(value: string)
    {
        setVersionSelected(value);
        if (value === "new")
        {
            setSessionVersion("0.0.0");
        }
        else
        {
            setSessionVersion(value);
        }
    }

    async function onTestTypeSelected(type: TestType)
    {
        if (appSelected === null)
        {
            console.warn("Test selected with no app?!");
            return;
        }
        // TODO: make userID a hook?! Or cache?
        const user_id = await getUserID(user.sub);
        const response = await serverAPI<ISession>(API.Sessions, HTTP.CREATE, undefined, { user_id, app_version: sessionVersion, app_id: appSelected.id, type });
        history.push(`${props.sessionURL}/${response.id}`);
    }

    if (state == State.App)
    {
        return <>
            <p>Choose which app you would like to test:</p>
            {isLoading && renderSkeletons()}
            {!isLoading && configuredApplications.applications.map((app) =>
                <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => onAppSelected(app)}/>
            )}
            {!isLoading && configuredApplications.shared.filter((sharedApp) => sharedApp.role !== Roles.Guest).map((app) =>
                <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => onAppSelected(app)}/>
            )}
            {!isLoading && configuredApplications.applications.length === 0 && configuredApplications.shared.length === 0 && <p>You have no apps configured, you'll need to make one first.</p>}
        </>
    }
    else if (state == State.Features)
    {
        const isNewVersion = versionSelected === "new";
        return <>
            <h4>Session Information</h4>
            <p>Information about your test session.</p>
            <div>
                <span style={{ display: "inline-block", verticalAlign: "top", marginRight: 10 }}>
                    {/* <p style={{ margin: 0 }}>
                        Version
                    </p> */}
                    <select onChange={(evt) => { setVersion(evt.target.value) }}>
                        {versions.map((v) => <option value={v.version} key={v.version}>{v.version}</option>)}
                        <option value="new">New Version</option>
                    </select>
                </span>
                {isNewVersion && <TextField defaultValue="0.0.0" style={{ display: "inline-block", verticalAlign: "bottom" }} disabled={versionSelected!=="new"} onChange={(evt) => setSessionVersion(evt.target.value)}/>}
            </div>
            <h4>Session Type</h4>
            <p>Select a session type below to begin your testing session.</p>
            <InfoCard title="Regression Test" summary="Test all the features for this application" image={MediaType.Testing} onClick={() => onTestTypeSelected(TestType.Regression)}/>
            <InfoCard title="Integration Test" summary="Test all the untested features for this application" image={MediaType.Testing} onClick={() => onTestTypeSelected(TestType.Integration)}/>
            <InfoCard title="Critical Path Test" summary="Test only features that are a high priority for this application" image={MediaType.AvailableSoon}/>
            <InfoCard title="Test Common Issues" summary="Test only features that fail frequently for this application" image={MediaType.AvailableSoon}/>
            <InfoCard title="Exploratory Test" summary="Perform an exploratory test and report issues you find" image={MediaType.AvailableSoon}/>
            <InfoCard title="Localization Test" summary="Test each feature supports the desired languages" image={MediaType.AvailableSoon}/>
        </>
    }
    return <div>Invalid State</div>
}