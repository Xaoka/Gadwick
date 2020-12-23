import React, { useEffect, useState } from 'react';
import Features from '../../Features/Features';
import { IConfiguredApplication } from '../AppView';
import { Tab, Tabs } from '@material-ui/core';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import AutomationPieChart, { ChartType } from '../../Overview/Stats/AutomationPieChart';
import UserRoles from './UserRoles';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleIcon from '@material-ui/icons/People';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';
import PassRateGraph, { IVersionData } from '../../Overview/Stats/PassRateGraph';
import WidgetContainer from '../WidgetContainer';
import NotAvailable, { NotAvailableReason } from '../../NotAvailable';
import Settings from './Settings';

interface IAppDetails
{
    app: IConfiguredApplication;
}

export default function AppDetails(props: IAppDetails)
{
    const [versionData, setVersionData] = useState<IVersionData[]>([]);
    const [barGraphTitle, setBarGraphTitle] = useState<string>("Pass Rate");
    const [tab, setTab] = useState<number>(0);
    
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
    }, [])

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
            <Features appID={props.app.id}/>
        </div>
        <div hidden={tab !== 2}>
            <UserRoles app={props.app}/>
        </div>
        <div hidden={tab !== 3}>
            <Settings app={props.app}/>
        </div>
    </>
}