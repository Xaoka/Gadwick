import React from 'react';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LinkIcon from '@material-ui/icons/Link';
import { useHistory } from 'react-router-dom';

interface ILink
{
    src: string;
    label: string;
    internal?: boolean;
}

export default function Link(props: ILink)
{
    const history = useHistory();
    function onClick()
    {
        history.push(props.src);
    }
    if (props.internal)
    {
        return <a href={props.src}>
            {props.label}
            <LinkIcon fontSize="small" style={{ verticalAlign: "middle"}}/>
        </a>
    }
    else
    {
        return <a href={props.src} target="_blank">
            {props.label}
            <OpenInNewIcon fontSize="small" style={{ verticalAlign: "middle"}}/>
        </a>
    }
}