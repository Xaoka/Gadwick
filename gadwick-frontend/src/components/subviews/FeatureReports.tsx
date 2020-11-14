import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { useEffect } from 'react';
import { useState } from 'react';
import serverAPI, { API, HTTP } from '../../apis/api';
import { IFeature } from '../overview';

interface ITestResult
{
    feature_id: string;
    passed: boolean;
    id: string;
    version: string;
}

export default function FeatureReports(props: { feature: IFeature, style: CSSProperties })
{
    const [results, setResults] = useState<ITestResult[]>([]);

    useEffect(() => {
        serverAPI<ITestResult[]>(API.TestResults, HTTP.READ, props.feature["feature-id"]).then(setResults);
    }, [props.feature])

    return <span style={props.style}>
        <div className="heading">Feature Test Reports</div>
        <TableContainer component={Paper}>
        <Table aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Product Version</TableCell>
                <TableCell align="left">Status</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {results.map((result) =>
                <TableRow key={result.id}>
                    <TableCell>{result.version}</TableCell>
                    <TableCell>{result.passed ? "PASSED" : "FAILED"}</TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
        </TableContainer>
    </span>
}