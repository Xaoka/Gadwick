import { IconButton, Card, Tooltip } from '@material-ui/core';
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
import AppDetails from './AppDetails/AppDetails';
import BreadcrumbPath from '../../BreadcrumbPath';
import { appNameToURL } from '../../../utils/ToURL';
import SubView from '../SubView';
// import { IAppUser } from './AppDetails/UserTable';
import { Roles } from './AppDetails/UserRoles';
import useSubscription from '../../../apis/subscription';
import { SubscriptionTier } from '../Subscription/Subscription';
import InfoIcon from '@material-ui/icons/Info';

export interface IConfiguredApplication
{
    /** Application ID */
    id: string;
    name: string;
    features: number;
    stability: number;
    client_secret: string;
    description: string;
    user_id: string;
}

export interface IAppInvite extends IConfiguredApplication
{
    role: Roles;
    invite_email: string;
    invite_status: "Invited"|"Accepted";
    app_id: string;
    invite_id: string;
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
    const tier = useSubscription();
    
    useEffect(loadApplications, [])

    function loadApplications()
    {
        setIsLoading(true);
        getUserID(user.sub).then((user_id) =>
        {
            if (!user_id) { return; }
            serverAPI<IUserApps>(API.Applications, HTTP.READ, user_id).then((apps) =>
            {
                setConfiguredApplications(apps)
                setIsLoading(false);
            });
        })
    }

    async function onSubmit(appData: { name: string, description: string })
    {
        setIsLoading(true);
        setNewDialogOpen(false);
        const user_id = await getUserID(user.sub);
        if (!user_id) { return; }
        await serverAPI(API.Applications, HTTP.CREATE, undefined, { user_id, name: appData.name, description: appData.description })
        const newApps = await serverAPI<IUserApps>(API.Applications, HTTP.READ, user_id)
        setIsLoading(false);
        setConfiguredApplications(newApps);
    }

    async function onInviteAccepted()
    {
        const user_id = await getUserID(user.sub);
        await serverAPI(API.Invites, HTTP.UPDATE, invite?.invite_id, { invite_status: "Accepted", user_id });
        loadApplications();
        setInvite(null);
    }
    async function onInviteDeclined()
    {
        await serverAPI(API.Invites, HTTP.DELETE, invite?.invite_id);
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

    function appRoute(app: IConfiguredApplication)
    {
        return <PrivateRoute path={`${path}/${appNameToURL(app.name)}`} key={app.id}>
            <BreadcrumbPath baseURL={url} stages={["Applications", app.name]}/>
            <AppDetails app={app}/>
        </PrivateRoute>
    }

    let newAppRequirement = SubscriptionTier.Free;
    if (configuredApplications.applications.length >= 2)
    {
        newAppRequirement = SubscriptionTier.Standard;
    }
    if (configuredApplications.applications.length >= 10)
    {
        newAppRequirement = SubscriptionTier.Premium;
    }
    let canMakeApp = false;
    if (newAppRequirement === SubscriptionTier.Free) { canMakeApp = true; }
    if (newAppRequirement === SubscriptionTier.Standard && tier !== SubscriptionTier.Free) { canMakeApp = true; }
    if (newAppRequirement === SubscriptionTier.Premium && tier === SubscriptionTier.Premium) { canMakeApp = true; }
    const maxApps = (tier === SubscriptionTier.Free) ? 2 : 10;

    return <SubView title="Applications">
        <Switch>
            {/** TODO: Links for all apps */}
            {configuredApplications.applications.map(appRoute)}
            {configuredApplications.shared.map(appRoute)}
            <PrivateRoute path="/">
                <BreadcrumbPath baseURL={url} stages={["Applications"]}/>
                <h2>My Apps
                    {tier !== SubscriptionTier.Premium && <>
                        {` (${configuredApplications.applications.length}/${maxApps}) `}
                        <Tooltip title={`Your ${tier} subscription entitles you to ${maxApps} apps. To have more, upgrade your subscription.`}>
                            <InfoIcon/>
                        </Tooltip>
                    </>}
                </h2>
                {configuredApplications.applications.map((app) =>
                    <InfoCard image={MediaType.Application} title={app.name} summary={app.description} key={app.name} onClick={() => onAppSelected(app)}/>
                )}
                {canMakeApp && <Card style={{ width: 300, height: 260, display: "inline-block", margin: 10, boxShadow: "grey 3px 3px 11px -4px"}}>
                    <IconButton style={{ width: "100%", height: "100%" }} onClick={() => setNewDialogOpen(true)}>
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Card>}
                {configuredApplications.shared.length>0 && <>
                    <h2>Shared with me</h2>
                    {configuredApplications.shared.map((app) =>
                        <InfoCard image={MediaType.Application} title={app.name} summary={app.description} key={app.name} onClick={() => onAppSelected(app)}/>
                    )}
                </>}
                {configuredApplications.invites.length>0 && <>
                    <h2>Invites</h2>
                    {configuredApplications.invites.map((app) =>
                        <InfoCard image={MediaType.Application} title={app.name} summary={app.description} key={app.name} onClick={() => setInvite(app)}/>
                    )}
                </>}
            </PrivateRoute>
        </Switch>
        <NewApplicationDialog open={newDialogOpen} onClose={() => setNewDialogOpen(false)} onSubmit={onSubmit}/>
        <AcceptInviteDialog open={invite!==null} onClose={() => setInvite(null)} onAccept={onInviteAccepted} onDecline={onInviteDeclined} invite={invite||undefined}/>
        <DeleteDialog open={appToDelete!==null} onClose={() => setAppToDelete(null)} onSubmit={onAppDeleted} targetType="Application" deleteTargetText="all features and test results associated with it"/>
    </SubView>
}