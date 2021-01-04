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
                {/* <BreadcrumbPath baseURL={url} stages={["Browse"]}/> */}
                <h2>Basics</h2>
                <div style={{ padding: 40 }}>
                    <InfoCard image={MediaType.AvailableSoon} title="Your first test" summary="Get started and learn how to write your first test."/>
                    <InfoCard image={MediaType.Code} onClick={() => openTutorial("setup", "Setting up Gadwick")} title="Setting up Gadwick" summary="Learn how to integrate your test suites with Gadwick."/>
                </div>
                <h2>Foundational</h2>
                <div style={{ padding: 40 }}>
                    <InfoCard image={MediaType.AvailableSoon} /*onClick={() => openTutorial("robust-tests", "Writing robust tests")}*/ title="Writing robust tests" summary="Learn how to write tests that don't break every time you change something."/>
                    <InfoCard image={MediaType.AvailableSoon} title="HTML and DOM" summary="Get to grips with how web pages work under the hood."/>
                </div>
                <h2>Advanced</h2>
                <div style={{ padding: 40 }}>
                    <InfoCard image={MediaType.AvailableSoon} title="Continuous Integration" summary="Learn about the methodology of CI and how to get started."/>
                    <InfoCard image={MediaType.AvailableSoon} title="BrowserStack" summary="Level up your device testing by harnessing BrowserStack."/>
                    <InfoCard image={MediaType.AvailableSoon} title="MITM Attacks" summary="Learn about Man In The Middle attacks and how to test for them."/>
                    <InfoCard image={MediaType.AvailableSoon} title="SQL Injection" summary="Learn about Man In The Middle attacks and how to test for them."/>
                </div>
                <h2>External Links</h2>
                <div style={{ padding: 40 }}>
                    <InfoCard image={MediaType.TAU} title="Automation University" summary="Visit the test automation university and take courses on automation." onClick={() => window.open("https://testautomationu.applitools.com/")}/>
                </div>
            </PrivateRoute>
        </Switch>
    </SubView>
}