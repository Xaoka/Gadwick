import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';

interface IIncident
{
    topic: string;
    type: string;
    status: string;
    note: string;
}

export default function IncidentReports()
{
    const incidents: IIncident[] = [];
    return <>
        <h3>Incident Reports</h3>
        <p>Incident reports allow you to track and manage problems that arise within your production environment.</p>
        <button>New Incident</button>
        <h4>Reports</h4>
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Topic</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Note</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {incidents.map((incident, i) =>
                    {
                        return <TableRow key={i} id={`${i}`}>
                            <TableCell id={`${i}_version`}>{incident.topic}</TableCell>
                            <TableCell id={`${i}_version`}>{incident.type}</TableCell>
                            <TableCell id={`${i}_version`}>{incident.status}</TableCell>
                            <TableCell id={`${i}_version`}>{incident.note}</TableCell>
                        </TableRow>
                    } )}
                </TableBody>
            </Table>
        </TableContainer>
        {/* This would require us to fix the nested page
        <h4>Public Dashboard</h4>
        You can enable the public dashboard for this application, which will make your incident report history visible at */}
    </>
}