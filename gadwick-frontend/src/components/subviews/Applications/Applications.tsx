import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from "@auth0/auth0-react";
import getUserID from '../../../apis/user';
import NewApplicationDialog from './NewApplicationDialog';
import Snippets from './Snippets';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import copyToClipboard from '../../../utils/Clipboard';

export interface IConfiguredApplication
{
    id: string;
    name: string;
    features: number;
    stability: number;
    client_secret: string;
}

export default function Applications()
{
    const { user } = useAuth0();
    const [configuredApplications, setConfiguredApplications] = useState<IConfiguredApplication[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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
        setIsLoading(true);
        const user_id = await getUserID(user.sub);
        await serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.CREATE, undefined, { user_id, name: formData[0].value })
        const newApps = await serverAPI<IConfiguredApplication[]>(API.Applications, HTTP.READ, user_id)
        setIsLoading(false);
        setConfiguredApplications(newApps);
    }

    if (isLoading)
    {
        return <div>
            Loading...
        </div>
    }
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
                    <TableCell>Client Secret</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {configuredApplications.map((app) =>
                    {
                        const domID = app.id;
                        return <TableRow key={domID} id={domID}>
                            <TableCell id={`${domID}_name`}>{app.name}</TableCell>
                            <TableCell id={`${domID}_features`}>{app.features || 0}</TableCell>
                            <TableCell id={`${domID}_stability`}>{app.stability || 0}%</TableCell>
                            <TableCell id={`${domID}_client_secret`}>
                                {app.client_secret}
                                <IconButton onClick={() => copyToClipboard(app.client_secret)}>
                                    <FileCopyIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    } )}
                </TableBody>
            </Table>
        </TableContainer>
        { !isLoading && configuredApplications.length === 0 ? <>
            <div className="subtitle">Configure your first application</div>
            <p>An application in Gadwick is a product or site you wish to set up testing for.</p>
            <p>You'll need to choose a name for your application.</p>
        </> : null}
        <button onClick={() => setDialogOpen(true)}>New Application</button>
        <NewApplicationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={onSubmit}/>
        <div className="subtitle">Testing with Gadwick</div>
        <p>Testing with Gadwick is simple and fits right into your existing test suites.</p>
        <Snippets app={configuredApplications[0]}/> {/** TODO: User to select the app for the tutorial */}
    </>
}