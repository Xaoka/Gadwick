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
    const [quickEditFeature, setQuickEditFeature] = useState<IFeature|null>(null)

    const chevron = <ChevronRightIcon style={{ right: 0, verticalAlign: "bottom" }} fontSize="large"/>;

    useEffect(refreshFeatures, [])

    function refreshFeatures()
    {
        getUserID(user.sub).then((user_id) =>
        {
            if (!user_id) { return; }
            serverAPI<IFeature[]>(API.PriorityFeatures, HTTP.READ, user_id).then(setPriorityFeatures);
        });
    }

    return <>
        <h2>Features</h2>
        {/* <h4>Quick Setup</h4> */}
        {/** TODO: Re-add feature importing later */}
        {/* <button onClick={() => setImportDialogOpen(true)}>
            Import Features
            {chevron}
        </button> */}
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