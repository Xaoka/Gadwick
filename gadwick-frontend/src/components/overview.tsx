import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../apis/api';
import { CSSProperties } from '@material-ui/core/styles/withStyles';


export default function Overview(props: { style?: CSSProperties })
{

    const myData = [
        {x: 'A', y: 10},
        {x: 'B', y: 5},
        {x: 'C', y: 15}
      ]
    return <span style={props.style}>
        <div className="title">Project overview</div>
        <div className="subtitle">Test Suite Performance</div>
        <div style={{ padding: 50 }}>
        <FlexibleXYPlot xType="ordinal" width={700} height={200} yDomain={[0, 20]} >
            <VerticalBarSeries data={myData} barWidth={0.95}/>
            <XAxis />
            <YAxis />
        </FlexibleXYPlot>
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