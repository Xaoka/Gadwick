import React from 'react';
import View from './subviews/View';
import Overview from './subviews/Overview/overview';
import AppView from './subviews/Applications/AppView';
import Tutorials from './subviews/Tutorials/Tutorials';
import TestSession from './subviews/TestSession/TestSession';
import Settings from './subviews/Settings/Settings';
import Subscription from './subviews/Subscription/Subscription';
import Admin from './subviews/Admin/Admin';

import AppsIcon from '@material-ui/icons/Apps';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';

export default function Dashboard()
{
    return <View pages={[
        {
            subView: <Overview/>,
            icon: AccountCircleIcon,
            buttonID: "sidebar_overview",
            pageURL: "overview"
        },
        {
            subView: <AppView/>,
            icon: AppsIcon,
            buttonID: "sidebar_applications",
            pageURL: "applications"
        },
        // {
        //     subView: <FeatureReports/>,
        //     icon: ListIcon,
        //     buttonID: "sidebar_reports",
        //     pageURL: "reports"
        // },
        {
            subView: <TestSession/>,
            icon: AssignmentIcon,
            buttonID: "sidebar_test_session",
            pageURL: "test_session"
        },
        {
            subView: <Tutorials/>,
            icon: EmojiObjectsIcon,
            buttonID: "sidebar_tutorials",
            pageURL: "tutorials"
        },
        {
            subView: <Subscription/>,
            icon: CreditCardIcon,
            buttonID: "sidebar_subscription",
            pageURL: "subscription"
        },
        {
            subView: <Settings/>,
            icon: SettingsIcon,
            buttonID: "sidebar_settings",
            pageURL: "settings"
        },
        {
            subView: <Admin/>,
            icon: BuildIcon,
            buttonID: "sidebar_admin",
            pageURL: "admin",
            localOnly: true
        },
    ]} sidebarScale={1.25}/>
}