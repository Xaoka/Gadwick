import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import StatBox from './StatBox';
import CategoryIcon from '@material-ui/icons/Category';
import { useAuth0 } from "@auth0/auth0-react";
import QuickSetup from './QuickSetup';

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

export default function Overview(props: { style?: CSSProperties, children?: React.ReactNode })
{
    const { user } = useAuth0();
    const [versionData, setVersionData] = useState<IVersionPassRate[]>([]);
    const [stats, setStats] = useState<IStats>({ featureCount: 0, failedCount: 0,untestedCount: 0 });
    useEffect(() =>
    {
        serverAPI<IVersionPassRate[]>(API.VersionRates, HTTP.READ).then(setVersionData);
        serverAPI<IStats>(API.Stats, HTTP.READ).then(setStats);
    }, [])
    
    return <span style={props.style}>
        <h1>Profile</h1>
        <h2>{user.name}</h2>
        <div style={{ display: "flex", padding: 0 }}>
            <span style={{ padding: 25, flex: 3, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <h2>
                    Stats
                    <select style={{ float: "right", fontSize: 16 }}>
                        <option value="pass_rate">Pass Rate</option>
                        <option value="coverage">Feature Coverage</option>
                    </select>
                </h2>
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
            </span>
            <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <QuickSetup/>
            </span>
        </div>
        {/* <div className="subtitle">Features</div>
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()} */}
    </span>
}