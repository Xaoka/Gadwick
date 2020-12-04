import React from 'react';
import { IConfiguredApplication } from '../Applications/Applications';
import Snippets from './Snippets';
import BreadcrumbPath from '../../BreadcrumbPath';
import { useRouteMatch } from 'react-router-dom';

export default function Setup(/*props: { app: IConfiguredApplication }*/)
{
    return <>
        <p>Testing with Gadwick is simple and fits right into your existing test suites.</p>
        <Snippets/> {/** TODO: User to select the app for the tutorial */}
    </>
}