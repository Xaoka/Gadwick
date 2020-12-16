import React, { useEffect, useState } from 'react';
import { Cell, ContentRenderer, Pie, PieChart, PieChartProps, PieLabelRenderProps } from 'recharts'
import serverAPI, { API, HTTP } from '../../../../apis/api';

interface IAutomationStats
{
    automated: number;
    important: number;
    possible: number;
    not_worth: number;
    not_configured: number;
}

export default function AutomationPieChart()
{
    const [stats, setStats] = useState<IAutomationStats>({ automated: 0, important: 0, possible: 0, not_worth: 0, not_configured: 0 });
    useEffect(() => {
        
        serverAPI<IAutomationStats>(API.AutomationStats, HTTP.READ).then(setStats);
    }, [])

    // TODO: Account for 0-count segments that would overlap
    const data =
    [
        {
            value: stats.automated,
            name: "Automated features",
            color: "#34eb3a"
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

    return <PieChart width={650} height={300}>
        {/** TODO: Modify label line to avoid overlaps */}
        <Pie dataKey="value" isAnimationActive={false} data={data} cx={325} cy={150} outerRadius={110} fill="#8884d8" label={renderCustomizedLabel} paddingAngle={0}>
            {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
            }
        </Pie>
    </PieChart>
}