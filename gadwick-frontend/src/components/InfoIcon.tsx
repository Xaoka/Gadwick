import React, { CSSProperties } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';

interface IInfo
{
    title: string;
    style?: CSSProperties;
}

export default function Info(props: IInfo)
{
    return <Tooltip title={props.title} style={props.style}>
        <InfoIcon/>
    </Tooltip>
}