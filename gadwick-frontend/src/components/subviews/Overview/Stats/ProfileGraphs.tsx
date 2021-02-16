import { Dialog, DialogTitle, Grid, IconButton } from '@material-ui/core';
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
import CloseIcon from '@material-ui/icons/Close'
import NewAppForm from '../../Applications/NewAppForm';
import { useSnackbarMessages } from '../../../snackbar/SnackbarContext';
import { appNameToURL } from '../../../../utils/ToURL';

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
    const snackbar = useSnackbarMessages();
    
    const [stats, setStats] = useState<IStats>({ appCount: 0, featureCount: 0, failedCount: 0, untestedCount: 0 });
    const [userID, setUserID] = useState<string>("");
    const [welcomeDialogOpen, setWelcomeDialogOpen] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() =>
    {
        getUserID(user.sub).then((id) => setUserID(id||""));
    }, [])

    useEffect(() => {
        if (userID.length === 0) { return; }
        serverAPI<IStats>(API.Stats, HTTP.READ, userID).then((newStats) =>
        {
            setLoaded(true);
            setStats(newStats);
        });
    }, [userID])

    useEffect(() => {
        if (!loaded) { return; }
        if (stats.appCount === 0)
        {
            setWelcomeDialogOpen(true);
        }
    }, [stats])

    function newApp(data: {name: string, description: string})
    {
        serverAPI(API.Applications, HTTP.CREATE, undefined, { ...data, user_id: userID }).then(() =>
        {
            snackbar?.sendSnackbarMessage("App created", "success");
            history.push(`/dashboard/applications/${appNameToURL(data.name)}`);
        });
    }

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
        <Dialog open={welcomeDialogOpen} maxWidth="sm" onClose={() => setWelcomeDialogOpen(false)} id="welcome_dialog">
            <DialogTitle style={{ paddingLeft: 40, paddingRight: 40 }}>
                <h3>
                    Welcome to Gadwick!
                    <IconButton style={{float: "right"}} onClick={() => setWelcomeDialogOpen(false)}><CloseIcon/></IconButton>
                </h3>
            </DialogTitle>
            <div style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40 }}>
                <p>Gadwick provides a powerful platform for managing and testing features, as well as learning more about the exciting world of automation!</p>
                <p>You've not got any applications set up yet, so let's set up your first application so we can add some features to it!</p>
                <NewAppForm onSubmit={newApp}/>
            </div>
        </Dialog>
    </>
}