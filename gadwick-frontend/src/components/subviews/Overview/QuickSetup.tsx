import React, { CSSProperties, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FeatureImport from './FeatureImport';
import TestResultImport from './TestResultImport';
import { IFeature } from '../Features/Features';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { useAuth0 } from '@auth0/auth0-react';
import getUserID from '../../../apis/user';
import { useHistory, useRouteMatch } from 'react-router-dom';
import FeatureConfigDialog from '../Features/FeatureConfigDialog';

const optionCSS: CSSProperties =
{
    width: 100,
    height: 100,
    borderRadius: 15,
    borderColor: "transparent",
    color: "white",
    backgroundColor: "var(--theme-primary)",
    textAlign: "center",
    alignContent: "center",
    display: "inline-block"
}

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

    useEffect(() =>
    {
        getUserID(user.sub).then((user_id) =>
        {
            serverAPI<IFeature[]>(API.PriorityFeatures, HTTP.READ, user_id).then(setPriorityFeatures);
        });
    }, [])

    function scoreStyling(score: number): CSSProperties
    {
        const style: CSSProperties =
        {
            // position: "fixed",
            // right: 5,
            // bottom: 5,
            verticalAlign: "middle",
            borderRadius: 999,
            borderStyle: "solid",
            width: "1.5em",
            height: "1.5em",
            textAlign: "center",
            fontWeight: "bold",
            color: "black"
        };
        if (score > 55)
        {
            style.backgroundColor = "#f2908d";
            style.borderColor = "darkred";
        }
        else if (score > 45)
        {
            style.backgroundColor = "#f5d0a9";
            style.borderColor = "#b55d00";
        }
        else if (score > 25)
        {
            style.backgroundColor = "#f3f5d5";
            style.borderColor = "#d4bb00";
        }
        else
        {
            style.backgroundColor = "#ededed";
            style.borderColor = "#616161";
        }
        style.color = style.borderColor;
        return style;
    }

    return <>
        <h2>Features</h2>
        {/* <h4>Quick Setup</h4> */}
        <button onClick={() => setImportDialogOpen(true)}>
            Import Features
            {chevron}
        </button>
        {/* <button onClick={() => setFeatureDialogOpen(true)}>
            Import Test Results
            {chevron}
        </button> */}
        <h4>Test Automation Priority</h4>
        {priorityFeatures.map((f) =>
        {
            const score = ((f.use_frequency * f.severity) + (f.fix_priority * f.distinctness) + (f.time_cost * f.ease) + (f.problem_frequency * f.similar_problem_frequency));
            return <div className="list-item" onClick={() => setQuickEditFeature(f)}>
                {f.name}
                <span style={scoreStyling(score)}>
                    {score}
                </span>
            </div>
        })}
        <FeatureConfigDialog feature={quickEditFeature} onClose={() => setQuickEditFeature(null)}/>
        <FeatureImport open={importDialogOpen} onClose={() => setImportDialogOpen(false)}/>
        <TestResultImport open={featureDialogOpen} onClose={() => setFeatureDialogOpen(false)}/>
    </>
}