import React from 'react';
import View from './subviews/View';
import Overview from './subviews/Overview/overview';
import Features from './subviews/Features/Features';
import FeatureReports from './subviews/FeatureReports';
import Applications from './subviews/Applications/Applications';
import Tutorials from './subviews/Tutorials/Tutorials';

import TuneIcon from '@material-ui/icons/Tune';
import ListIcon from '@material-ui/icons/List';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

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
            subView: <FeatureReports/>,
            icon: ListIcon,
            buttonID: "sidebar_reports",
            pageURL: "reports"
        },
        {
            subView: <Features/>,
            icon: TuneIcon,
            buttonID: "sidebar_features",
            pageURL: "features"
        },
        {
            subView: <Applications/>,
            icon: VerifiedUserIcon,
            buttonID: "sidebar_applications",
            pageURL: "applications"
        },
        {
            subView: <Tutorials/>,
            icon: EmojiObjectsIcon,
            buttonID: "sidebar_tutorials",
            pageURL: "tutorials"
        }
    ]} sidebarScale={1.25}/>
}