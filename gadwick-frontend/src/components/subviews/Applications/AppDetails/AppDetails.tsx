import React, { useEffect, useState } from 'react';
import Features from '../../Features/Features';
import { IConfiguredApplication } from '../AppView';
import { Tab, Tabs } from '@material-ui/core';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import AutomationPieChart, { ChartType } from '../../Overview/Stats/AutomationPieChart';
import UserRoles, { Roles } from './UserRoles';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleIcon from '@material-ui/icons/People';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';
import PassRateGraph, { IVersionData } from '../../Overview/Stats/PassRateGraph';
import WidgetContainer from '../WidgetContainer';
import NotAvailable, { NotAvailableReason } from '../../NotAvailable';
import Settings from './Settings';
import getUserID, { IUser } from '../../../../apis/user';
import { IAppUser } from './UserTable';
import getCurrentPermissionLevel from './permissionLevel';
import { useAuth0 } from '@auth0/auth0-react';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import TagsManager from './TagsManager';

interface IAppDetails
{
    app: IConfiguredApplication;
}

export default function AppDetails(props: IAppDetails)
{
    const { user } = useAuth0();
    const [versionData, setVersionData] = useState<IVersionData[]>([]);
    const [barGraphTitle, setBarGraphTitle] = useState<string>("Pass Rate");
    const [tab, setTab] = useState<number>(0);
    const [invites, setInvites] = useState<IAppUser[]>([])
    const [users, setUsers] = useState<IAppUser[]>([])
    const [owner, setOwner] = useState<IUser>({ name: "", id: "", auth_id: "", auth_service: "", email: "" })
    const [currentUser, setCurrentUser] = useState<string|null>(null);
    const [permissionLevel, setPermissionLevel] = useState<Roles>(Roles.Guest);
    
    useEffect(() => {
        
        serverAPI<IVersionData[]>(API.VersionRates, HTTP.READ).then((versions) =>
        {
            // TODO: Enforce this format on version submission?
            const newVersions = versions.sort((v1: IVersionData, v2: IVersionData) =>
            {
                const version1 = v1.version.split(".").map((v) => parseInt(v));
                const version2 = v2.version.split(".").map((v) => parseInt(v));
                if (version1[0] > version2[0]) { return 1; }
                if (version1[0] < version2[0]) { return -1; }
                
                if (version1[1] > version2[1]) { return 1; }
                if (version1[1] < version2[1]) { return -1; }
                
                if (version1[2] > version2[2]) { return 1; }
                if (version1[2] < version2[2]) { return -1; }

                return 0;
            })
            setVersionData(newVersions);
        });
        getUserID(user.sub).then(setCurrentUser);
        serverAPI<IUser>(API.Users, HTTP.READ, props.app.user_id).then(setOwner);
        serverAPI<IAppUser[]>(API.AppRoles, HTTP.READ, props.app.id).then(setUsers);
    }, [])

    useEffect(() => {
        if (!currentUser) { return; }
        if (!owner) { return; }
        setPermissionLevel(getCurrentPermissionLevel(currentUser, invites, owner))
    }, [currentUser, owner, invites])

    // TODO: Unify this with sidebar
    return <>
        <Tabs
            value={tab}
            onChange={(evt, value) => setTab(value)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example">
            <Tab icon={<EqualizerIcon />} aria-label="Analytics" label="Analytics" />
            <Tab icon={<ListIcon />} aria-label="Features" label="Features" />
            <Tab icon={<LocalOfferIcon />} aria-label="Tags" label="Tags" />
            <Tab icon={<PeopleIcon />} aria-label="Users" label="Users" />
            <Tab icon={<SettingsIcon />} aria-label="Settings" label="Settings" />
        </Tabs>
        <div hidden={tab !== 0}>
            {/* <h3>Analytics</h3>
            <StatBox label="Version" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Features" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Stability" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/> */}
            <WidgetContainer title="Feature Priority">
                <AutomationPieChart scale={0.5} id={props.app.id} type={ChartType.App}/>
            </WidgetContainer>
            <WidgetContainer title={barGraphTitle}>
                <PassRateGraph versionData={versionData}/>
            </WidgetContainer>
            <WidgetContainer>
                <NotAvailable reason={NotAvailableReason.ComingSoon}/>
            </WidgetContainer>
            <WidgetContainer>
                <NotAvailable reason={NotAvailableReason.ComingSoon}/>
            </WidgetContainer>
        </div>
        <div hidden={tab !== 1}>
            <Features appID={props.app.id} permissionLevel={permissionLevel}/>
        </div>
        <div hidden={tab !== 2}>
            <TagsManager appID={props.app.id} permissionLevel={permissionLevel}/>
        </div>
        <div hidden={tab !== 3}>
            <UserRoles app={props.app} invites={invites} setInvites={setInvites} owner={owner} users={users} setUsers={setUsers} permissionLevel={permissionLevel}/>
        </div>
        <div hidden={tab !== 4}>
            <Settings app={props.app} permissionLevel={permissionLevel}/>
        </div>
    </>
}