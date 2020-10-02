import React, { CSSProperties, useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles, Paper } from '@material-ui/core';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../apis/api';
import ExpandableTableRow from './ExpandableTableRow';

export interface IFeatureRatings
{
    passRate: number;
    distinctness: number;
    ease: number;
    priority: number;
    problem_frequency: number;
    severity: number;
    similar_frequency: number;
    use_frequency: number;
    cost: number;
}

export interface IFeature extends IFeatureRatings
{
    "feature-id": string;
    name: string;
    description: string;
}

export default function Overview()
{
    const [features, setFeatures] = useState<IFeature[]>([])
    useEffect(() => {
        serverAPI<IFeature[]>(API.Features, HTTP.READ).then((data) =>
        {
            setFeatures(data);
            console.dir(data)
        });
    }, [])
    // const useStyles = makeStyles({
    //   table: {
    //     // minWidth: 650,
    //     // paddingLeft: 200,
    //     // paddingRight: 200
    //   },
    // });
    // const [features, setFeatures] = useState([{ name: "Feature 1", status: "NEW", passRate: 12}])

    function rowMapping(feature: IFeature)
    {
        return [
            { name: "Name", value: feature.name },
            { name: "Description", value: feature.description },
            { name: "Pass Rate", value: `${feature.passRate}%` }
        ]
    }

    function renderFeatureTable()
    {
        return <>
            <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Feature Name</TableCell>
                    {/* <TableCell align="right">Status</TableCell> */}
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Pass Rate (%)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {(features.length > 0) && features.map((feature) => (
                    <ExpandableTableRow key={feature.name} data={rowMapping(feature)} featureData={feature}/>
                    // <TableRow key={feature.name}>
                    // <TableCell component="th" scope="row">
                    //     {feature.name}
                    // </TableCell>
                    // <TableCell align="right">{feature.description}</TableCell>
                    // <TableCell align="right">{feature.passRate}%</TableCell>
                    // </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </>
    }
    const myData = [
        {x: 'A', y: 10},
        {x: 'B', y: 5},
        {x: 'C', y: 15}
      ]
    return <>
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
        <div className="subtitle">Features</div>
        <button style={{ color: "green" }}>New</button>
        {renderFeatureTable()}
    </>
}