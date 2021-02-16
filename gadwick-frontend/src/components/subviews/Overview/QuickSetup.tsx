import React, { CSSProperties, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FeatureImport from './FeatureImport';
import TestResultImport from './TestResultImport';
import { IFeature } from '../Features/Features';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from '@auth0/auth0-react';
import getUserID from '../../../apis/user';
// import { useHistory, useRouteMatch } from 'react-router-dom';
import FeatureConfigDialog from '../Features/FeatureConfigDialog';
import FeaturePriority from '../Features/FeaturePriority';
import NoData from '../NoData';
import { IConfiguredApplication, IUserApps } from '../Applications/AppView';
import { Tooltip } from '@material-ui/core';

// const optionCSS: CSSProperties =
// {
//     width: 100,
//     height: 100,
//     borderRadius: 15,
//     borderColor: "transparent",
//     color: "white",
//     backgroundColor: "var(--theme-primary)",
//     textAlign: "center",
//     alignContent: "center",
//     display: "inline-block"
// }

export default function QuickSetup()
{
    const { user } = useAuth0();
    // let { path, url } = useRouteMatch();
    // const history = useHistory();
    
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [featureDialogOpen, setFeatureDialogOpen] = useState(false)
    const [priorityFeatures, setPriorityFeatures] = useState<IFeature[]>([])
    const [apps, setApps] = useState<IConfiguredApplication[]>([])
    const [quickEditFeature, setQuickEditFeature] = useState<IFeature|null>(null)

    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;

    useEffect(refreshFeatures, [])

    function refreshFeatures()
    {
        getUserID(user.sub).then((user_id) =>
        {
            if (!user_id) { return; }
            serverAPI<IFeature[]>(API.PriorityFeatures, HTTP.READ, user_id).then((features) =>
            {
                setPriorityFeatures(features.map((f) =>
                {
                    f.steps = f.steps ? JSON.parse(f.steps as any) : [""];
                    return f;
                }))
            });
            serverAPI<IUserApps>(API.ApplicationsForUser, HTTP.READ, user_id).then((userApps) => setApps(userApps.applications));
        });
    }

    return <>
        <h4>Quick Setup</h4>
        {/* {apps.length === 0 && <button onClick={() => setImportDialogOpen(true)}>
            Create App
            {chevron}
        </button>} */}
        {<Tooltip title={apps.length === 0 ? "No apps to import into" : ""}>
            <span>
                <button onClick={() => setImportDialogOpen(true)} disabled={apps.length === 0}>
                    Import Features
                    {chevron}
                </button>
            </span>
        </Tooltip>}
        {/* <button onClick={() => setFeatureDialogOpen(true)}>
            Import Test Results
            {chevron}
        </button> */}
        <h4>Test Automation Priority</h4>
        {priorityFeatures.length === 0 && <NoData/>}
        {priorityFeatures.length > 0 && priorityFeatures.map((f) =>
        {
            return <div id={f.id} className="list-item" onClick={() => setQuickEditFeature(f)} key={f.id}>
                <span>
                    {f.name}
                    <div className="info">{f.app_name}</div>
                </span>
                <FeaturePriority priority={f.priority}/>
            </div>
        })}
        <FeatureConfigDialog feature={quickEditFeature} onClose={() => { setQuickEditFeature(null); refreshFeatures(); }}/>
        <FeatureImport open={importDialogOpen} onClose={() => setImportDialogOpen(false)}/>
        <TestResultImport open={featureDialogOpen} onClose={() => setFeatureDialogOpen(false)}/>
    </>
}