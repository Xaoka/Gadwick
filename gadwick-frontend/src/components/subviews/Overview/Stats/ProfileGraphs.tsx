import { Grid } from '@material-ui/core';
import React, { useEffect, useState, version } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import serverAPI, { API, HTTP } from '../../../../apis/api';
import AutomationPieChart, { ChartType } from './AutomationPieChart';
import StatBox from './StatBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BugReportIcon from '@material-ui/icons/BugReport';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import getUserID from '../../../../apis/user';
import AppsIcon from '@material-ui/icons/Apps';

interface IStats
{
    appCount: number;
    featureCount: number;
    failedCount: number;
    untestedCount: number;
}

export default function ProfileGraphs()
{
    const { user } = useAuth0();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    
    const [stats, setStats] = useState<IStats>({ appCount: 0, featureCount: 0, failedCount: 0, untestedCount: 0 });
    const [userID, setUserID] = useState<string>("");

    useEffect(() =>
    {
        getUserID(user.sub).then((id) => setUserID(id||""));
    }, [])

    useEffect(() => {
        serverAPI<IStats>(API.Stats, HTTP.READ, userID).then(setStats);
    }, [userID])

    return <>
        <h2>
            Metrics
            {/* <select style={{ float: "right", fontSize: 16 }}>
                <option value="all">All Apps</option>
                <option value="coverage">Feature Coverage</option>
            </select> */}
        </h2>
        <Grid container direction="row" justify="center" alignItems="center">
            <StatBox label="Applications" value={stats.appCount} icon={AppsIcon} onClick={() => history.push(`/dashboard/applications`)}/>
            <StatBox label="Features" value={stats.featureCount} icon={AssignmentIcon} onClick={() => history.push(`/dashboard/applications`)}/>
            <StatBox label="bugs caught" value={stats.failedCount} icon={BugReportIcon} onClick={() => history.push(`/dashboard/reports`)}/>
            <StatBox label="Untested Features" value={stats.untestedCount} icon={AssignmentLateIcon} onClick={() => history.push(`/dashboard/test_session`)}/>
        </Grid>
        <h2>Feature Automation</h2>
        <AutomationPieChart  id={userID} type={ChartType.User}/>
    </>
}