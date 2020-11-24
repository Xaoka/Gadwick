import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../../apis/api';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import StatBox from '../StatBox';
import CategoryIcon from '@material-ui/icons/Category';

interface IVersionPassRate
{
    passRate: number;
    version: string;
}

export default function Overview(props: { style?: CSSProperties, children?: React.ReactNode })
{
    const [versionData, setVersionData] = useState<IVersionPassRate[]>([]);
    useEffect(() =>
    {
        serverAPI<IVersionPassRate[]>(API.VersionRates, HTTP.READ).then(setVersionData);
    }, [])
    
    return <span style={props.style}>
        <div className="title">Project overview</div>
        <div className="subtitle">Test Suite Performance</div>
        <div style={{ padding: 50 }}>
        <FlexibleXYPlot xType="ordinal" width={700} height={200} yDomain={[0, 100]} >
            <VerticalBarSeries data={versionData.map((v) => { return { x: v.version, y: v.passRate * 100 }})} barWidth={0.95}/>
            <XAxis />
            <YAxis />
        </FlexibleXYPlot>
        <Grid container direction="column" justify="center" alignItems="center" style={{ display: "inline" }}>
            <Grid container direction="row" justify="center" alignItems="center">
                <StatBox label="tests" value={345} icon={CategoryIcon}/>
                <StatBox label="incomplete" value={12} icon={CategoryIcon}/>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
                <StatBox label="users" value={123546} icon={CategoryIcon}/>
                <StatBox label="bugs caught" value={44095682} icon={CategoryIcon}/>
            </Grid>
        </Grid>
        </div>
        <div>
            <button>Pass Rate</button>
            <button>Priority Feature Coverage</button>
        </div>
        {/* <div className="subtitle">Features</div>
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()} */}
    </span>
}