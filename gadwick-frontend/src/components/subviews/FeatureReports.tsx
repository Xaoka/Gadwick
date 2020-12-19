import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { useEffect } from 'react';
import { useState } from 'react';
import serverAPI, { API, HTTP } from '../../apis/api';
import SubView from './SubView';

export interface ITestResult
{
    feature_id: string;
    passed: string;
    id: string;
    version: string;
    name: string;
}

export default function FeatureReports(props: { /*feature: IFeature,*/ style?: CSSProperties })
{
    const [results, setResults] = useState<ITestResult[]>([]);

    // useEffect(() => {
    //     serverAPI<ITestResult[]>(API.TestResults, HTTP.READ, props.feature["feature-id"]).then(setResults);
    // }, [props.feature])
    useEffect(() => {
        serverAPI<ITestResult[]>(API.TestResults, HTTP.READ).then(setResults);
    }, [])

    return <SubView title="Test Reports">
        <h2>Version stability</h2>
        <TableContainer component={Paper}>
        <Table aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Product Version</TableCell>
                <TableCell>Feature</TableCell>
                <TableCell align="left">Status</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {results.map((result) =>
                {
                    const domID = `result_entry_${result.name ? result.name.replace(" ", "_").toLowerCase() : " "}`;
                    return <TableRow key={domID} id={domID}>
                        <TableCell id={`${domID}_version`}>{result.version}</TableCell>
                        <TableCell id={`${domID}_name`}>{result.name}</TableCell>
                        <TableCell id={`${domID}_passed`}>{result.passed ? "PASSED" : "FAILED"}</TableCell>
                    </TableRow>
                } )}
            </TableBody>
        </Table>
        </TableContainer>
    </SubView>
}