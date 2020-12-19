import React from 'react';
import { useRouteMatch, Switch, useHistory } from 'react-router-dom';
import BreadcrumbPath from '../../BreadcrumbPath';
import PrivateRoute from '../../PrivateRoute';
import SubView from '../SubView';
import NewSession from './NewSession';
import Overview from './Overview';
import SessionView from './SessionView';

export default function TestSession()
{
    let { path, url } = useRouteMatch();
    const history = useHistory();
    return <SubView title="Test Sessions">
        <Switch>
            <PrivateRoute path={`${path}/new`}>
                <BreadcrumbPath stages={["Sessions", "New"]} baseURL={url}/>
                <NewSession sessionURL={`${path}/session`}/>
            </PrivateRoute>
            <PrivateRoute path={`${path}/:session`} >
                <BreadcrumbPath stages={["Sessions", "Session 1234"]} baseURL={url}/>
                <SessionView onAbandon={() => history.push(url)}/>
            </PrivateRoute>
            <PrivateRoute path={`${path}`} >
                <BreadcrumbPath stages={["Sessions"]} baseURL={url}/>
                <Overview/>
            </PrivateRoute>
        </Switch>
    </SubView>
}