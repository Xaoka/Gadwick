import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import { IFeature } from '../../Features/Features';
import { ISession } from '../Overview';
import { Status } from '../Overview';
import { TestType } from '../NewSession';
import { ITestResult } from '../../Features/Results';

interface IExploratorySession
{
    session: ISession;
    onComplete: () => void;
}

export default function ExploratorySession(props: IExploratorySession)
{
    const [allAppFeatures, setAllAppFeatures] = useState<IFeature[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<IFeature|null>(null);
    const [reason, setReason] = useState<string>("");
    const [results, setResults] = useState<ITestResult[]>([])
    
    useEffect(() => {
        serverAPI<IFeature[]>(API.AppFeatures, HTTP.READ, props.session.app_id).then(setAllAppFeatures);
        serverAPI<ITestResult[]>(API.SessionResults, HTTP.READ, props.session.id).then(setResults);
    }, [])

    useEffect(() => {
        setSelectedFeature(allAppFeatures[0]);
    }, [allAppFeatures])

    function onExploratoryResult()
    {
        if (!selectedFeature) { return; }
        if (props.session.status == Status.NOT_STARTED)
        {
            serverAPI<ISession>(API.Sessions, HTTP.UPDATE, props.session.id, { status: Status.INCOMPLETE });
            props.session.status = Status.INCOMPLETE;
        }

        const result =
        {
            feature_id: selectedFeature.id,
            passed: false,
            version: props.session.app_version,
            session_id: props.session.id,
            automated: "FALSE",
            reason
        }
        serverAPI<ITestResult>(API.TestResults, HTTP.CREATE, undefined, result);
        const testResult: ITestResult =
        {
            ...result,
            id: "?",
            name: "?",
            automated: "FALSE",
            passed: "FALSE"
        }
        setResults([...results, testResult]);
        setReason("");
    }

    function renderSession()
    {
        return <>
            <p>
                Provide a description of the issue and the feature you think best matches the problem found.
            </p>
            <h4>Defect Information</h4>
            <span>Feature: </span>
            <select>
                {allAppFeatures.map((f) => <option value={f.id} onClick={() => setSelectedFeature(f)} key={f.id}>
                    {f.name}
                </option>)}
            </select>
            <TextField label="Reason (Optional)" multiline={true} style={{ display: "block" }} fullWidth={true} onChange={(evt) => setReason(evt.target.value)} value={reason}/>
            <button className="danger" onClick={onExploratoryResult}>Report Issue</button>
            <button className="success" onClick={props.onComplete}>Finish Testing</button>
        </>
    }

    function renderResults()
    {
        return <>
            <h4>Defects reported:</h4>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Feature</TableCell>
                            <TableCell>Defect</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((r) =>
                        {
                            const featureMatches = allAppFeatures.filter((f) => f.id == r.feature_id);
                            const name = featureMatches.length > 0 ? featureMatches[0].name : "Not Found";
                            return <TableRow>
                                <TableCell>{name}</TableCell>
                                <TableCell>{r.reason}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    }
    
    return <>
        <h3>Exploratory Test</h3>
        {props.session.status !== Status.COMPLETE && renderSession()}
        {props.session.status == Status.COMPLETE && <p>Exploratory Test complete.</p>}
        {renderResults()}
    </>
}