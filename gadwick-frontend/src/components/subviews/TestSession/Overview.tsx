import { useAuth0 } from '@auth0/auth0-react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { useRouteMatch, useHistory } from 'react-router-dom';

interface IBaseSession
{
    id: string;
    started_on: string;
    status: Status;
    app_id: string;
    app_name: string;
    app_version: string;
    user_id: string;
    user_name: string;
    features_passed: number;
    submitted: 0|1;
}

export interface ISession extends IBaseSession
{
    feature_ids: string[];
}

export interface ISessionResponse extends IBaseSession
{
    feature_ids: string;
}

export enum Status
{
    NOT_STARTED = "NOT_STARTED",
    INCOMPLETE = "INCOMPLETE",
    COMPLETE = "COMPLETE",
    ABANDONED = "ABANDONED"
}

export default function Overview()
{
    const { user } = useAuth0();
    let { path } = useRouteMatch();
    const history = useHistory();
    
    const [sessions, setSessions] = useState<ISession[]>([])

    useEffect(() => {
        getUserID(user.sub).then((user_id) =>
        {
            if (!user_id) { return; }
            serverAPI<ISession[]>(API.SessionsByAuth, HTTP.READ, user_id).then(setSessions);
        });
    }, [])

    function getStatusStyling(status: string): string
    {
        if (status === Status.COMPLETE) { return "success"; }
        if (status === Status.ABANDONED) { return "danger"; }
        if (status === Status.INCOMPLETE) { return "warning"; }
        if (status === Status.NOT_STARTED) { return "major-warning"; }
        return "";
    }

    function renderPassRate(session: ISession)
    {
        const passed = session.features_passed;
        const failed = (session.feature_ids ? JSON.parse(session.feature_ids as any).length : 0) - passed;
        const rate = ((passed/(passed+failed)) * 100);
        let className = "success";
        if (rate < 60) { className = "danger"; }
        else if (rate < 80) { className = "major-warning"; }
        else if (rate < 100) { className = "warning"; }
        return <TableCell className={className}>{rate.toFixed(1)}% ({passed}/{passed+failed})</TableCell>
    }

    function goToSession(session: ISession)
    {
        history.push(`${path}/session/${session.id}`);
    }

    // TODO: Only count it as "Active" if we're the one who started it
    const activeSessions = sessions.filter((s) => s.status !== Status.COMPLETE && s.status !== Status.ABANDONED);
    const activeSessionCount = activeSessions.length;
    return <>
        <p>This view allows you to start, manage and review testing sessions for your applications. The results of these sessions can be used to automatically update tickets on third party apps.</p>
        <p>You can have one active session running at any time, but there may be other active test sessions being run by other users at the same time.</p>
        <h4>Active Session</h4>
        {activeSessionCount === 0 && <p>You do not have any sessions active.</p> }
        {activeSessionCount > 0 && <button onClick={() => history.push(`${path}/session/${activeSessions[0].id}`)}>Resume Active Session</button>}
        {<button onClick={() => history.push(`${path}/new`)}>Start New Session</button>}

        <h4>Session History</h4>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>App</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Features Passed</TableCell>
                        {/** TODO: Future feature */}
                        {/* <TableCell>Critical Features</TableCell>
                        <TableCell>Important Features</TableCell>
                        <TableCell>Minor Features</TableCell> */}
                        <TableCell>Tester</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map((session) =>
                    <TableRow id={session.id} hover onClick={() => goToSession(session)} key={session.id}>
                        <TableCell>{session.app_name}</TableCell>
                        <TableCell>{session.app_version}</TableCell>
                        <TableCell className={getStatusStyling(session.status)}>{session.status}</TableCell>
                        {renderPassRate(session)}
                        {/* <TableCell>0/0</TableCell>
                        <TableCell>0/0</TableCell> */}
                        <TableCell>{session.user_name}</TableCell>
                        <TableCell>{(new Date(session.started_on)).toLocaleDateString()}</TableCell>
                        <TableCell>{(new Date(session.started_on)).toLocaleTimeString()}</TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}