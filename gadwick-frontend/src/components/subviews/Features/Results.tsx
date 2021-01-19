import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import NoData from '../NoData';
import { IFeature } from './Features';

interface IResults
{
    feature: IFeature;
}

export interface ITestResult
{
    feature_id: string;
    passed: string;
    id: string;
    version: string;
    name: string;
    automated: "TRUE"|"FALSE"|null;
    reason?: string;
}

export default function Results(props: IResults)
{
    const [results, setResults] = useState<ITestResult[]>([])
    useEffect(() => {
        serverAPI<ITestResult[]>(API.TestResults, HTTP.READ, props.feature.id).then(setResults);
    }, [])

    if (results.length === 0)
    {
        return <>
            <h3>Results</h3>
            <NoData/>
        </>
    }

    return <>
        <h3>Results</h3>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Product Version</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Note</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result) =>
                    {
                        const domID = `result_entry_${result.name ? result.name.replace(" ", "_").toLowerCase() : " "}`;
                        return <TableRow key={result.id} id={domID}>
                            <TableCell id={`${domID}_version`}>{result.version}</TableCell>
                            <TableCell id={`${domID}_name`}>{result.automated === "TRUE" ? "AUTOMATED" : "MANUAL"}</TableCell>
                            <TableCell id={`${domID}_passed`}>{result.passed ? "PASSED" : "FAILED"}</TableCell>
                            <TableCell id={`${domID}_reason`}>{result.reason}</TableCell>
                        </TableRow>
                    } )}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}