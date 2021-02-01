import React from 'react';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

interface ILink
{
    src: string;
    label: string;
}

export default function Link(props: ILink)
{
    return <a href={props.src} target="_blank">
        {props.label}
        <OpenInNewIcon fontSize="small" style={{ verticalAlign: "middle"}}/>
    </a>
}