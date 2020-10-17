import React, { CSSProperties, useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles, Paper } from '@material-ui/core';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../apis/api';
import ExpandableTableRow, { IData } from './ExpandableTableRow';

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
    feature_name: string;
    description: string;
}

export default function Overview()
{
    const [features, setFeatures] = useState<IFeature[]>([])
    useEffect(() => {
        updateList();
    }, [])
    // const useStyles = makeStyles({
    //   table: {
    //     // minWidth: 650,
    //     // paddingLeft: 200,
    //     // paddingRight: 200
    //   },
    // });
    // const [features, setFeatures] = useState([{ name: "Feature 1", status: "NEW", passRate: 12}])

    function rowMapping(feature: IFeature): IData<any>[]
    {
        return [
            {
                name: "Name",
                value: feature.feature_name,
                inputProperties:
                {
                    editable: true,
                    onUpdate: (feature_name: string) => serverAPI(API.Features, HTTP.UPDATE, feature["feature-id"], { feature_name })
                }
            },
            {
                name: "Description",
                value: feature.description,
                inputProperties:
                {
                    editable: true,
                    onUpdate: (description: string) => serverAPI(API.Features, HTTP.UPDATE, feature["feature-id"], { description })
                }
            },
            {
                name: "Pass Rate",
                value: `${feature.passRate}%`
            }
        ]
    }

    function updateList()
    {
        serverAPI<IFeature[]>(API.Features, HTTP.READ).then((data) =>
        {
            setFeatures(data);
            console.dir(data)
        });
    }

    async function onDelete(feature: IFeature)
    {
      await serverAPI(API.Features, HTTP.DELETE, feature["feature-id"]);
      updateList();
    }

    async function createNew()
    {
        await serverAPI(API.Features, HTTP.CREATE, undefined, { name: "New Feature", description: "New Feature", passRate: 0 });
        updateList();
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
                    <ExpandableTableRow key={feature.feature_name} data={rowMapping(feature)} featureData={feature} onDelete={onDelete}/>
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
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()}
    </>
}