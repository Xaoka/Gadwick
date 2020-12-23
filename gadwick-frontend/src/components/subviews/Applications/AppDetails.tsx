import React, { useEffect, useState } from 'react';
import Features from '../Features/Features';
import StatBox from '../Overview/Stats/StatBox';
import { IConfiguredApplication } from './AppView';
import CategoryIcon from '@material-ui/icons/Category';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import copyToClipboard from '../../../utils/Clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import AutomationPieChart, { ChartType } from '../Overview/Stats/AutomationPieChart';
import UserRoles from './UserRoles';

interface IAppDetails
{
    app: IConfiguredApplication;
}
interface IVersionPassRate
{
    passRate: number;
    version: string;
}

export default function AppDetails(props: IAppDetails)
{
    const [versionData, setVersionData] = useState<IVersionPassRate[]>([]);
    const [barGraphTitle, setBarGraphTitle] = useState<string>("Pass Rate");
    
    useEffect(() => {
        
        serverAPI<IVersionPassRate[]>(API.VersionRates, HTTP.READ).then((versions) =>
        {
            // TODO: Enforce this format on version submission?
            const newVersions = versions.sort((v1: IVersionPassRate, v2: IVersionPassRate) =>
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

    return <div style={{ display: "grid", gridTemplateColumns: "65% 35%"}}>
        <div style={{ paddingRight: "5%" }}>
            <h3>Details</h3>
            {/* <div>App Name</div>
            <input defaultValue={props.app.name}/>
            <div>Description</div>
            <input defaultValue={props.app.description}/> */}
            <TextField label="App Name" defaultValue={props.app.name} style={{ display: "block" }}/>
            <TextField label="Description" defaultValue={props.app.description} style={{ display: "block" }} fullWidth={true}/>
            <div>
                <div>
                    You can connect your test suite to Gadwick by using the Gadwick reporter and configuring it with your client secret for this app:
                </div>
                <input defaultValue={props.app.client_secret} disabled style={{ width: 250 }}/>
                <Tooltip title="Copy client secret to clipboard">
                    <IconButton onClick={() => copyToClipboard(props.app.client_secret)}>
                        <FileCopyIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            <UserRoles app={props.app}/>
            <Features appID={props.app.id}/>
        </div>
        
        <div>
            <h3>Analytics</h3>
            <StatBox label="Version" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Features" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Stability" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <h3>Feature priority</h3>
            <AutomationPieChart scale={0.6} id={props.app.id} type={ChartType.App}/>
            <h3>{barGraphTitle}</h3>
            {/* <FlexibleXYPlot xType="ordinal" width={500} height={200} yDomain={[0, 100]} >
                <VerticalBarSeries data={versionData.map((v) => { return { x: v.version, y: v.passRate * 100 }})} barWidth={0.95}/>
                <XAxis />
                <YAxis />
            </FlexibleXYPlot> */}
        </div>
    </div>
}