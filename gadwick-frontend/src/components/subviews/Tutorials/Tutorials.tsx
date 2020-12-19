import React, { useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import BreadcrumbPath from '../../BreadcrumbPath';
import InfoCard, { MediaType } from '../../InfoCard';
import PrivateRoute from '../../PrivateRoute';
import Setup from './Setup';
import RobustTests from './RobustTests';
import SubView from '../SubView';

export default function Tutorials()
{
    let { path, url } = useRouteMatch();
    const history = useHistory();

    function openTutorial(urlExt: string, title: string)
    {
        history.push(`${url}/${urlExt}`)
    }

    return <SubView title="Tutorials">
        <Switch>
            <PrivateRoute path={`${path}/setup`}>
                <BreadcrumbPath baseURL={url} stages={["Browse", "Setting up Gadwick"]}/>
                <div style={{ padding: 40 }}>
                    <Setup/>
                </div>
            </PrivateRoute>
            <PrivateRoute path={`${path}/robust-tests`}>
                <BreadcrumbPath baseURL={url} stages={["Browse", "Writing robust tests"]}/>
                <div style={{ padding: 40 }}>
                    <RobustTests/>
                </div>
            </PrivateRoute>
            <PrivateRoute path={path}>
                <BreadcrumbPath baseURL={url} stages={["Browse"]}/>
                <div style={{ padding: 40 }}>
                    <InfoCard image={MediaType.Code} onClick={() => openTutorial("setup", "Setting up Gadwick")} title="Setting up Gadwick" summary="Learn how to integrate your test suites with Gadwick."/>
                    <InfoCard image={MediaType.Code} onClick={() => openTutorial("robust-tests", "Writing robust tests")} title="Writing robust tests" summary="Learn how to write tests that don't break every time you change something."/>
                    <InfoCard image={MediaType.Code} title="Continuous Integration" summary="Learn about the methodology of CI and how to get started."/>
                </div>
            </PrivateRoute>
        </Switch>
    </SubView>
}