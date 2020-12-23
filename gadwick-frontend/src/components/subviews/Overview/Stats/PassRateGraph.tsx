import React from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import NoData from '../../NoData';

export interface IVersionData
{
    version: string;
    passRate: number;
}

interface IPassRateGraph
{
    versionData: IVersionData[]
}

export default function PassRateGraph(props: IPassRateGraph)
{
    if (props.versionData.length === 0)
    {
        return <NoData />
    }
    return <FlexibleXYPlot xType="ordinal" width={500} height={200} yDomain={[0, 100]} >
        <VerticalBarSeries data={props.versionData.map((v) => { return { x: v.version, y: v.passRate * 100 }})} barWidth={0.95}/>
        <XAxis />
        <YAxis />
    </FlexibleXYPlot>
}