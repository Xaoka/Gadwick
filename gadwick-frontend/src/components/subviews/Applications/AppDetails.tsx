import React from 'react';
import Features from '../Features/Features';
import StatBox from '../Overview/Stats/StatBox';
import { IConfiguredApplication } from './AppView';
import CategoryIcon from '@material-ui/icons/Category';
import { IconButton } from '@material-ui/core';
import copyToClipboard from '../../../utils/Clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';

interface IAppDetails
{
    app: IConfiguredApplication;
}

export default function AppDetails(props: IAppDetails)
{
    return <>
        <div>
            <StatBox label="Version" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Features" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
            <StatBox label="Stability" icon={CategoryIcon} value={0} style={{ display: "inline-block" }}/>
        </div>
        <h3>Details</h3>
        <div>Name <input defaultValue={props.app.name}/></div>
        <div>Description <input defaultValue={props.app.description}/></div>
        <div>
            Client Secret
            <input defaultValue={props.app.client_secret} disabled/>
            <IconButton onClick={() => copyToClipboard(props.app.client_secret)}>
                <FileCopyIcon/>
            </IconButton>
        </div>
        <Features appID={props.app.id}/>
    </>
}