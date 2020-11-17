import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper } from '@material-ui/core';
import serverAPI, { API, HTTP } from '../apis/api';
import ExpandableTableRow, { IData } from './ExpandableTableRow'
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import FeatureConfig from './subviews/FeatureConfig';
import View from './subviews/View';

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

export default function Features(props: { style?: CSSProperties })
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
                        <TableCell>Feature Name</TableCell>
                        {/* <TableCell align="right">Status</TableCell> */}
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="left">Pass Rate (%)</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {(features.length > 0) && features.map((feature) => (
                    <>
                    {/* <TableRow key={feature["feature-id"]}>
                        {rowMapping(feature).map((datum) => <TableCell key={datum.name} align="left">{datum.value}</TableCell>)}
                    </TableRow> */}
                    <ExpandableTableRow key={feature.feature_name} data={rowMapping(feature)} featureData={feature} onDelete={onDelete} style={{ display: "flex", flexDirection: "row" }}>
                        <FeatureConfig feature={feature} style={{flex: 5, paddingLeft: 20}}/>
                    </ExpandableTableRow>
                    </>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </>
    }
    return <span style={props.style}>
        <div className="title">Features</div>
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()}
        </span>
}