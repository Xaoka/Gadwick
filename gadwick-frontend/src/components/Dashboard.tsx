import React from 'react';
import Overview from './subviews/overview';
import Features from './subviews/Features';
import View from './subviews/View';
import FeatureReports from './subviews/FeatureReports';
import TuneIcon from '@material-ui/icons/Tune';
import ListIcon from '@material-ui/icons/List';
import AssessmentIcon from '@material-ui/icons/Assessment';

export default function Dashboard()
{
    return <View pages={[
        {
            subView: <Overview/>,
            icon: AssessmentIcon,
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
        }
    ]} sidebarScale={1.25}/>
}