import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper } from '@material-ui/core';
import serverAPI, { API, HTTP } from '../../apis/api';
import ExpandableTableRow, { IData } from '../ExpandableTableRow'
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import FeatureConfig from './FeatureConfig';
import View from './View';
import FeatureConfigDialog from '../dialogs/FeatureConfig';

export interface IFeatureRatings
{
    passRate: number;
    distinctness: number;
    ease: number;
    fix_priority: number;
    problem_frequency: number;
    severity: number;
    similar_problem_frequency: number;
    use_frequency: number;
    time_cost: number;
}

export interface IFeature extends IFeatureRatings
{
    id: string;
    name: string;
    description: string;
}

export default function Features(props: { style?: CSSProperties })
{
    const [dialogFeature, setDialogFeature] = useState<IFeature|null>(null);
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
                value: feature.name
            },
            {
                name: "Description",
                value: feature.description
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
    async function onDelete(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, feature: IFeature)
    {
        evt.preventDefault();
        evt.stopPropagation();
        await serverAPI(API.Features, HTTP.DELETE, feature.id);
        updateList();
    }

    async function createNew()
    {
        await serverAPI(API.Features, HTTP.CREATE, undefined, { name: "New Feature", description: "New Feature" });
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
                    <TableRow onClick={() => setDialogFeature(feature)} key={feature.id}>
                        {rowMapping(feature).map((datum) => <TableCell key={datum.name} align="left" >{datum.value}</TableCell>)}
                        <TableCell>
                            <button className="danger" onClick={(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onDelete(evt, feature)}>
                                <span role="img" aria-label="trash">🗑️</span>
                            </button>
                        </TableCell>
                    {/* <ExpandableTableRow key={feature.name} data={rowMapping(feature)} featureData={feature} onDelete={onDelete}>
                        <FeatureConfig feature={feature} />
                    </ExpandableTableRow> */}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </>
    }
    return <>
        <span style={props.style}>
            <div className="title">Features</div>
            <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
            {renderFeatureTable()}
        </span>
        <FeatureConfigDialog feature={dialogFeature} onClose={() => setDialogFeature(null)}/>
    </>
}