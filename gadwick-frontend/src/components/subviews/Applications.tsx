import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../apis/api';
import { useAuth0 } from "@auth0/auth0-react";
import getUserID from '../../apis/user';

interface IConfiguredApplication
{
    id: string;
    name: string;
    features: number;
    stability: number;
}

export default function Applications()
{
    const { user } = useAuth0();
    const [configuredApplications, setConfiguredApplications] = useState<IConfiguredApplication[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(loadApplications, [])

    function loadApplications()
    {
        setIsLoading(true);
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.READ, user_id).then((apps) =>
            {
                setConfiguredApplications(apps)
                setIsLoading(false);
            });
        })
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        event.stopPropagation();
        console.dir(event.target);
        const formData = event.target as any; // TODO: Figure out why react doesn't know the typing
        setSubmitting(true)
        setIsLoading(true);
        const user_id = await getUserID(user.sub);
        await serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.CREATE, undefined, { user_id, name: formData[0].value })
        const newApps = await serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.READ, user_id)
        setSubmitting(false);
        setIsLoading(false);
        setConfiguredApplications(newApps);
    }

    if (isLoading)
    {
        return <div>
            Loading...
        </div>
    }
    if (configuredApplications.length === 0)
    {
        return <>
            <div className="title">Applications</div>
            <div className="subtitle">Configure your first application</div>
            <p>An application in Gadwick is a product or site you wish to set up testing for.</p>
            <p>You'll need to choose a name for your application.</p>
            <form onSubmit={onSubmit}>
                <input defaultValue="My App" key="name"/><button disabled={submitting}>Submit</button>
            </form>
        </>
    }
    else
    {
        return <>
            <div className="title">Applications</div>
            <div className="subtitle">Configured Applications</div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Application</TableCell>
                        <TableCell>Features</TableCell>
                        <TableCell>Stability</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {configuredApplications.map((app) =>
                        {
                            const domID = app.id;
                            return <TableRow key={domID} id={domID}>
                                <TableCell id={`${domID}_name`}>{app.name}</TableCell>
                                <TableCell id={`${domID}_features`}>{app.features}</TableCell>
                                <TableCell id={`${domID}_stability`}>{app.stability}</TableCell>
                            </TableRow>
                        } )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="subtitle">Testing with Gadwick</div>
        </>
    }
}