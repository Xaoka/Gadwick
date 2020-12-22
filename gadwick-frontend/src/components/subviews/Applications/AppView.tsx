import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from "@auth0/auth0-react";
import getUserID from '../../../apis/user';
import NewApplicationDialog from './NewApplicationDialog';
import DeleteDialog from '../../DeleteDialog';
import AcceptInviteDialog from './AcceptInviteDialog';
import InfoCard, { MediaType } from '../../InfoCard';
import AddIcon from '@material-ui/icons/Add';
import PrivateRoute from '../../PrivateRoute';
import { useRouteMatch, useHistory, Switch } from 'react-router-dom';
import AppDetails from './AppDetails';
import BreadcrumbPath from '../../BreadcrumbPath';
import { appNameToURL } from '../../../utils/ToURL';
import SubView from '../SubView';
import { IAppUser } from './UserTable';
import { Roles } from './UserRoles';

export interface IConfiguredApplication
{
    id: string;
    name: string;
    features: number;
    stability: number;
    client_secret: string;
    description: string;
}

export interface IAppInvite extends IConfiguredApplication
{
    role: Roles;
    invite_email: string;
    invite_status: "Invited"|"Accepted";
    app_id: string;
    user_id: string;
}

export interface IUserApps
{
    applications: IConfiguredApplication[];
    shared: IAppInvite[];
    invites: IAppInvite[];
}

export default function AppView()
{
    const { user } = useAuth0();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    const [configuredApplications, setConfiguredApplications] = useState<IUserApps>({ applications: [], invites: [], shared: [] });
    const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false);
    const [invite, setInvite] = useState<IAppInvite|null>(null);
    const [appToDelete, setAppToDelete] = useState<IConfiguredApplication|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(loadApplications, [])

    function loadApplications()
    {
        setIsLoading(true);
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<IUserApps>(API.Applications, HTTP.READ, user_id).then((apps) =>
            {
                setConfiguredApplications(apps)
                setIsLoading(false);
            });
        })
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        event.stopPropagation();
        console.dir(event.target);
        const formData = event.target as any; // TODO: Figure out why react doesn't know the typing
        setIsLoading(true);
        const user_id = await getUserID(user.sub);
        await serverAPI(API.Applications, HTTP.CREATE, undefined, { user_id, name: formData[0].value })
        const newApps = await serverAPI<IUserApps>(API.Applications, HTTP.READ, user_id)
        setIsLoading(false);
        setConfiguredApplications(newApps);
    }

    async function onInviteAccepted()
    {
        const user_id = await getUserID(user.sub);
        await serverAPI(API.Invites, HTTP.UPDATE, invite?.id, { invite_status: "Accepted", user_id });
        loadApplications();
        setInvite(null);
    }
    async function onInviteDeclined()
    {
        await serverAPI(API.Invites, HTTP.DELETE, invite?.id);
        loadApplications();
        setInvite(null);
    }

    async function onAppDeleted()
    {
        if (!appToDelete) { return; }
        const id = appToDelete.id;
        setAppToDelete(null);
        await serverAPI(API.Applications, HTTP.DELETE, id);
        loadApplications();
    }

    if (isLoading)
    {
        return <div>
            Loading...
        </div>
    }

    function onAppSelected(app: IConfiguredApplication)
    {
        history.push(`${url}/${appNameToURL(app.name)}`)
    }

    return <SubView title="Applications">
        <Switch>
            {/** TODO: Links for all apps */}
            {configuredApplications.applications.map((app) =>
                <PrivateRoute path={`${path}/${appNameToURL(app.name)}`}>
                    <BreadcrumbPath baseURL={url} stages={["Applications", app.name]}/>
                    <AppDetails app={app}/>
                </PrivateRoute>
            )}
            <PrivateRoute path="/">
                <BreadcrumbPath baseURL={url} stages={["Applications"]}/>
                <h2>My Apps</h2>
                {configuredApplications.applications.map((app) =>
                    <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => onAppSelected(app)}/>
                )}
                <Card style={{ width: 220, height: 250, display: "inline-block", margin: 10, boxShadow: "grey 3px 3px 11px -4px"}}>
                    <IconButton style={{ width: "100%", height: "100%" }} onClick={() => setNewDialogOpen(true)}>
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Card>
                {configuredApplications.shared.length>0 && <>
                    <h2>Shared with me</h2>
                    {configuredApplications.shared.map((app) =>
                        <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => onAppSelected(app)}/>
                    )}
                </>}
                {configuredApplications.invites.length>0 && <>
                    <h2>Invites</h2>
                    {configuredApplications.invites.map((app) =>
                        <InfoCard image={MediaType.Application} title={app.name} summary="My app description goes here" key={app.name} onClick={() => setInvite(app)}/>
                    )}
                </>}
            </PrivateRoute>
        </Switch>
        <NewApplicationDialog open={newDialogOpen} onClose={() => setNewDialogOpen(false)} onSubmit={onSubmit}/>
        <AcceptInviteDialog open={invite!==null} onClose={() => setInvite(null)} onAccept={onInviteAccepted} onDecline={onInviteDeclined} invite={invite||undefined}/>
        <DeleteDialog open={appToDelete!==null} onClose={() => setAppToDelete(null)} onSubmit={onAppDeleted} targetType="Application" deleteTargetText="all features and test results associated with it"/>
    </SubView>
}