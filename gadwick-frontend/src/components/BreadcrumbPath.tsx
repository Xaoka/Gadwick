import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';

export default function BreadcrumbPath(props: { baseURL: string, stages: string[] })
{
    const history = useHistory();

    function redirect(extension: string)
    {
        history.push(`${props.baseURL}${extension}`);
    }

    function crumbs()
    {
        const crumbs = [];
        for (let i = 0; i < props.stages.length; i++)
        {
            if (i === props.stages.length - 1)
            {
                crumbs.push(<Typography color="textPrimary" key={props.stages[i]}>{props.stages[i]}</Typography>);
            }
            else
            {
                crumbs.push(<Link color="inherit" onClick={() => redirect("")} key={props.stages[i]}>
                        {props.stages[i]}
                    </Link>)
            }
        }
        return crumbs;
    }

    return <Breadcrumbs aria-label="breadcrumb">
        {crumbs()}
    </Breadcrumbs>
}