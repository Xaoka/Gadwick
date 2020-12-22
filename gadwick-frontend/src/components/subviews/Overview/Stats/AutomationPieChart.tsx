import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts'
import serverAPI, { API, HTTP } from '../../../../apis/api';
import NoData from '../../NoData';

interface IAutomationStats
{
    automated: number;
    important: number;
    possible: number;
    not_worth: number;
    not_configured: number;
}

export enum ChartType { App, User };

interface IAutomationPieChart
{
    type: ChartType;
    id: string;
    scale?: number;
}

export default function AutomationPieChart(props: IAutomationPieChart)
{
    const [stats, setStats] = useState<IAutomationStats>({ automated: 0, important: 0, possible: 0, not_worth: 0, not_configured: 0 });
    useEffect(() => {
        // TODO: Cleaner way of providing this interface catch for when loading
        if (props.id.length === 0) { return; }
        if (props.type === ChartType.User)
        {
            serverAPI<IAutomationStats>(API.UserAutomationStats, HTTP.READ, props.id).then(setStats);
        }
        else
        {
            serverAPI<IAutomationStats>(API.AppAutomationStats, HTTP.READ, props.id).then(setStats);
        }
    }, [props.id])

    // TODO: Account for 0-count segments that would overlap
    const data =
    [
        {
            value: stats.automated,
            name: "Automated features",
            color: "#59eb5e"
        },
        {
            value: stats.important,
            name: "Important features to test",
            color: "#eb4034"
        },
        {
            value: stats.possible,
            name: "Possible features to test",
            color: "#eb9934"
        },
        {
            value: stats.not_worth,
            name: "Features not worth testing",
            color: "#9190A3"
        },
        {
            value: stats.not_configured,
            name: "Features not configured",
            color: "#1157CF"
        }
    ]
    // const colorRange = ["#CF9C11", "#11CFAF", "#1157CF", "#9190A3"];


    function renderCustomizedLabel(props: any /*PieLabelRenderProps*/)//: ContentRenderer<PieLabelRenderProps>
    {
        // const toTheSide = props. 
        let percentOffset = 0;
        if (props.x < props.cx)
        {
            percentOffset = -props.name.length * 5;
        }
        else
        {
            percentOffset = props.name.length * 5;
        }
        return (<>
            <text x={props.x} y={props.y} fill="black" textAnchor={props.textAnchor}>
                {props.name}
            </text>
            <text x={props.x + percentOffset} y={props.y + 20} fill="grey" textAnchor={props.textAnchor}>
                {`${(props.percent * 100).toFixed(1)}%`}
            </text>
        </>);
    };

    const scale = props.scale || 1;
    const width = 300 + (350 * scale);
    const height = 150 + (200 * scale);
    if (stats.automated + stats.important + stats.not_configured + stats.not_worth + stats.possible <= 2)
    {
        return <NoData/>
    }

    return <PieChart width={width} height={height}>
        {/** TODO: Modify label line to avoid overlaps */}
        <Pie dataKey="value" isAnimationActive={false} data={data} cx={100 + (225 * scale)} cy={150 * scale} outerRadius={110 * scale} fill="#8884d8" label={renderCustomizedLabel} paddingAngle={0}>
            {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fontSize={10 + (6 * scale)}/>)
            }
        </Pie>
    </PieChart>
}