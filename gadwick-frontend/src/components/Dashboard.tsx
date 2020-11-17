import React from 'react';
import Overview from './overview';
import Features from './Features';
import View from './subviews/View';
import FeatureReports from './subviews/FeatureReports';
import TuneIcon from '@material-ui/icons/Tune';
import ListIcon from '@material-ui/icons/List';
import AssessmentIcon from '@material-ui/icons/Assessment';

export default function Dashboard()
{
    return <View pages={[
        {
            subView: <Overview />,
            icon: AssessmentIcon
        },
        {
            subView: <FeatureReports />,
            icon: ListIcon
        },
        {
            subView: <Features />,
            icon: TuneIcon
        }
    ]} sidebarScale={1.25}/>
}