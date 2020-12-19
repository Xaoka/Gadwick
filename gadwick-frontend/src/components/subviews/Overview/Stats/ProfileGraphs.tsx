import { Grid } from '@material-ui/core';
import React, { useEffect, useState, version } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import AutomationPieChart from './AutomationPieChart';
import StatBox from './StatBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BugReportIcon from '@material-ui/icons/BugReport';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { useRouteMatch, useHistory } from 'react-router-dom';

interface IVersionPassRate
{
    passRate: number;
    version: string;
}

interface IStats
{
    featureCount: number;
    failedCount: number;
    untestedCount: number;
}

export default function ProfileGraphs()
{
    let { path, url } = useRouteMatch();
    const history = useHistory();
    
    const [versionData, setVersionData] = useState<IVersionPassRate[]>([]);
    const [barGraphTitle, setBarGraphTitle] = useState<string>("Pass Rate");
    const [stats, setStats] = useState<IStats>({ featureCount: 0, failedCount: 0,untestedCount: 0 });
    useEffect(() =>
    {
        serverAPI<IVersionPassRate[]>(API.VersionRates, HTTP.READ).then((versions) =>
        {
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
        serverAPI<IStats>(API.Stats, HTTP.READ).then(setStats);
    }, [])

    return <>
        <h2>
            Metrics
            {/* <select style={{ float: "right", fontSize: 16 }}>
                <option value="all">All Apps</option>
                <option value="coverage">Feature Coverage</option>
            </select> */}
        </h2>
        <Grid container direction="row" justify="center" alignItems="center">
            <StatBox label="Features" value={stats.featureCount} icon={AssignmentIcon} onClick={() => history.push(`/dashboard/applications`)}/>
            <StatBox label="Untested Features" value={stats.untestedCount} icon={AssignmentTurnedInIcon} onClick={() => history.push(`/dashboard/test_session`)}/>
            <StatBox label="users" value={0} icon={PeopleIcon}/>
            <StatBox label="bugs caught" value={stats.failedCount} icon={BugReportIcon} onClick={() => history.push(`/dashboard/reports`)}/>
        </Grid>
        <h2>Feature Automation</h2>
        <AutomationPieChart />

        {/* TODO: Move this to the app page */}
        {/* <h3>{barGraphTitle}</h3>
        <FlexibleXYPlot xType="ordinal" width={700} height={200} yDomain={[0, 100]} >
            <VerticalBarSeries data={versionData.map((v) => { return { x: v.version, y: v.passRate * 100 }})} barWidth={0.95}/>
            <XAxis />
            <YAxis />
        </FlexibleXYPlot> */}
    </>
}