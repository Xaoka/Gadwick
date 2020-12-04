import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from "@auth0/auth0-react";
import getUserID from '../../../apis/user';
import AppView from './AppView';
import AppDetails from './AppDetails';

export interface IConfiguredApplication
{
    id: string;
    name: string;
    features: number;
    stability: number;
    client_secret: string;
    description: string;
}

export default function Applications()
{
    const { user } = useAuth0();
    const [appToView, setAppToView] = useState<IConfiguredApplication|null>(null);
    
    if (appToView)
    {
        return <>
            <h1>Applications</h1>
            <AppDetails app={appToView}/>
        </>
    }
    else
    {
        return <>
            <h1>Applications</h1>
            <AppView onAppSelected={setAppToView}/>
        </>
    }
}