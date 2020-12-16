import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import AutomationPieChart from './AutomationPieChart';

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
    const [versionData, setVersionData] = useState<IVersionPassRate[]>([]);
    const [barGraphTitle, setBarGraphTitle] = useState<string>("Pass Rate");
    const [stats, setStats] = useState<IStats>({ featureCount: 0, failedCount: 0,untestedCount: 0 });
    useEffect(() =>
    {
        serverAPI<IVersionPassRate[]>(API.VersionRates, HTTP.READ).then(setVersionData);
        serverAPI<IStats>(API.Stats, HTTP.READ).then(setStats);
    }, [])

    return <>
        <h2>Analytics</h2>
        <AutomationPieChart />

        <h3>
            {barGraphTitle}
            <select style={{ float: "right", fontSize: 16 }}>
                <option value="pass_rate">Pass Rate</option>
                <option value="coverage">Feature Coverage</option>
            </select>
        </h3>
        <FlexibleXYPlot xType="ordinal" width={700} height={200} yDomain={[0, 100]} >
            <VerticalBarSeries data={versionData.map((v) => { return { x: v.version, y: v.passRate * 100 }})} barWidth={0.95}/>
            <XAxis />
            <YAxis />
        </FlexibleXYPlot>
        {/* <Grid container direction="column" justify="center" alignItems="center" style={{ display: "inline" }}>
            <Grid container direction="row" justify="center" alignItems="center">
                <StatBox label="Features" value={stats.featureCount} icon={CategoryIcon}/>
                <StatBox label="Untested Features" value={stats.untestedCount} icon={CategoryIcon}/>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
                <StatBox label="users" value={0} icon={CategoryIcon}/>
                <StatBox label="bugs caught" value={stats.failedCount} icon={CategoryIcon}/>
            </Grid>
        </Grid> */}
    </>
}