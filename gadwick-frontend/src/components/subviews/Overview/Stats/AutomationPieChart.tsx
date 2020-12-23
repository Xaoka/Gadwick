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

    function pushData(value: number, name: string, color: string, array: { value: number, name: string, color: string }[])
    {
        if (value > 0)
        {
            array.push({ value, name, color});
        }
    }

    function getData()
    {
        let data: { value: number, name: string, color: string }[] = [];
        pushData(stats.automated, "Automated features", "#59eb5e", data);
        pushData(stats.important, "Important features to test", "#eb4034", data);
        pushData(stats.possible, "Possible features to test", "#eb9934", data);
        pushData(stats.not_worth, "Features not worth testing", "#9190A3", data);
        pushData(stats.not_configured, "Features not configured", "#1157CF", data);
        return data;
    }
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
    const statsArray = [stats.automated, stats.important, stats.not_configured, stats.not_worth, stats.possible];
    const sum = statsArray.reduce((s1, s2) => s1+s2);
    const overZeroCount = statsArray.filter((s) => s>0).length;
    if (sum <= 2)// || overZeroCount < 2)
    {
        return <NoData width={width}/>
    }

    return <PieChart width={width} height={height}>
        {/** TODO: Modify label line to avoid overlaps */}
        <Pie dataKey="value" isAnimationActive={false} data={getData()} cx={100 + (225 * scale)} cy={150 * scale} outerRadius={110 * scale} fill="#8884d8" label={renderCustomizedLabel} paddingAngle={0}>
            {
                getData().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fontSize={10 + (6 * scale)}/>)
            }
        </Pie>
    </PieChart>
}