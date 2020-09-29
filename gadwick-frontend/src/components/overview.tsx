import React, { CSSProperties, useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles, Paper } from '@material-ui/core';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import serverAPI from '../apis/api';
import ExpandableTableRow from './ExpandableTableRow';

interface IFeature
{
    name: string;
    description: string;
    passRate: number;
}

export default function Overview()
{
    const [features, setFeatures] = useState<IFeature[]>([])
    useEffect(() => {
        serverAPI<IFeature[]>().then((data) => setFeatures(data));
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
                {features.map((feature) => (
                    <ExpandableTableRow key={feature.name} data={rowMapping(feature)} moreInfo={feature.name}/>
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
        <div className="subtitle">Historic Utility</div>
        <div style={{ padding: 50 }}>
        <FlexibleXYPlot xType="ordinal" width={700} height={200} yDomain={[0, 20]} >
            <VerticalBarSeries data={myData} barWidth={0.95}/>
            <XAxis />
            <YAxis />
        </FlexibleXYPlot>
        </div>
        <div className="subtitle">Features</div>
        <button style={{ color: "green" }}>New</button>
        {renderFeatureTable()}
    </>
}