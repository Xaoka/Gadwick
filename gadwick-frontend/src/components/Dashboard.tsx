import React from 'react';
import View from './subviews/View';
import Overview from './subviews/Overview/overview';
import Features from './subviews/Features/Features';
import FeatureReports from './subviews/FeatureReports';
import AppView from './subviews/Applications/AppView';
import Tutorials from './subviews/Tutorials/Tutorials';
import TestSession from './subviews/TestSession/TestSession';

import TuneIcon from '@material-ui/icons/Tune';
import ListIcon from '@material-ui/icons/List';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import AssignmentIcon from '@material-ui/icons/Assignment';

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
            icon: VerifiedUserIcon,
            buttonID: "sidebar_applications",
            pageURL: "applications"
        },
        {
            subView: <Tutorials/>,
            icon: EmojiObjectsIcon,
            buttonID: "sidebar_tutorials",
            pageURL: "tutorials"
        },
        {
            subView: <FeatureReports/>,
            icon: ListIcon,
            buttonID: "sidebar_reports",
            pageURL: "reports"
        },
        {
            subView: <TestSession/>,
            icon: AssignmentIcon,
            buttonID: "sidebar_test_session",
            pageURL: "test_session"
        }
    ]} sidebarScale={1.25}/>
}