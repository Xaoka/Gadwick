import { useAuth0 } from '@auth0/auth0-react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import { useRouteMatch, Switch, useHistory } from 'react-router-dom';

interface IBaseSession
{
    id: string;
    started_on: string;
    status: Status;
    appID: string;
    appName: string;
    version: string;
    user: string;
}

export interface ISession extends IBaseSession
{
    feature_ids: string[];
}

export interface ISessionResponse extends IBaseSession
{
    feature_ids: string;
}

enum Status
{
    NOT_STARTED = "NOT_STARTED",
    INCOMPLETE = "INCOMPLETE",
    COMPLETE = "COMPLETE",
    ABANDONED = "ABANDONED"
}

export default function Overview()
{
    const { user } = useAuth0();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    
    const [sessions, setSessions] = useState<ISession[]>([])

    useEffect(() => {
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<ISession[]>(API.SessionsByAuth, HTTP.READ, user_id).then(setSessions);
        });
    }, [])

    const activeSessions = sessions.filter((s) => s.status !== Status.COMPLETE && s.status !== Status.ABANDONED);
    const activeSessionCount = activeSessions.length;
    return <>
        <h2>Overview</h2>
        <p>This view allows you to start, manage and review testing sessions. The results of these sessions can be used to automatically update tickets on third party apps.</p>
        {activeSessionCount === 0 && <p>You do not have any sessions active.</p> }
        {activeSessionCount === 0 && <button onClick={() => history.push(`${path}/new`)}>Start New Session</button>}
        {activeSessionCount > 0 && <button onClick={() => history.push(`${path}/session/${activeSessions[0].id}`)}>Resume Active Session</button>}

        <h3>Session History</h3>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>App</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Critical Features</TableCell>
                        <TableCell>Important Features</TableCell>
                        <TableCell>Minor Features</TableCell>
                        <TableCell>Tester</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map((session) =>
                    <TableRow>
                        <TableCell>{session.appName}</TableCell>
                        <TableCell>{session.version}</TableCell>
                        <TableCell>{session.status}</TableCell>
                        <TableCell>0/0</TableCell>
                        <TableCell>0/0</TableCell>
                        <TableCell>0/0</TableCell>
                        <TableCell>{session.user}</TableCell>
                        <TableCell>{(new Date(session.started_on)).toLocaleDateString()}</TableCell>
                        <TableCell>{(new Date(session.started_on)).toLocaleTimeString()}</TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}