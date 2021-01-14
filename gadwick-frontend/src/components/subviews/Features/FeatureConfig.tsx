import React, { CSSProperties, useState } from 'react';
import { useEffect } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import CombinedRating from './CombinedRating';
import { IFeature, IFeatureRatings } from './Features';
import SimpleRating from './SimpleRating';
import { Tab, Tabs, TextField } from '@material-ui/core';
import Steps from './Steps';
import DeleteDialog from '../../DeleteDialog';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Results from './Results';

interface IFeatureConfig
{
    feature: IFeature;
    style?: CSSProperties;
    onDeleted: () => void;
}

export default function FeatureConfig(props: IFeatureConfig)
{
    const [tab, setTab] = useState<number>(0);
    const [riskRating, setRiskRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [efficiencyRating, setEfficiencyRating] = useState(0);
    const [volatilityRating, setVolatilityRating] = useState(0);
    const [priorityRating, setPriorityRating] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [lastSavedScore, setLastSavedScore] = useState(0);

    function calculateRisk()
    {
        return Math.ceil((riskRating + valueRating + efficiencyRating + volatilityRating) / 4);
    }

    useEffect(() => {
        setPriorityRating(calculateRisk());
    // eslint-disable-next-line
    }, [riskRating, valueRating, efficiencyRating, volatilityRating])

    function getRecommendation()
    {
        if (priorityRating > 2.5)
        {
            return "writing automated tests for this feature."
        }
        else if (priorityRating > 1.5)
        {
            return "only doing manual tests for this feature."
        }
        else
        {
            return "regarding this feature as low priority for testing."
        }
    }

    function renderCombinedRating(primaryTitle: string, primaryKey: keyof IFeatureRatings, secondaryTitle: string, secondaryKey: keyof IFeatureRatings, resultTitle: string, setRating: (val: number) => void)
    {
        function onResultChanged(primaryRating: number, secondaryRating: number, resultRating: number)
        {
            setRating(resultRating);
            const payload: any = {};//TODO: Type
            payload[primaryKey] = primaryRating;
            payload[secondaryKey] = secondaryRating;
            serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, payload)
        }
        return <CombinedRating primaryRating={{ title: primaryTitle, initialValue: props.feature[primaryKey] as any }} secondaryRating={{ title: secondaryTitle, initialValue: props.feature[secondaryKey] as any }} resultRatingTitle={resultTitle} onResultChanged={onResultChanged}/>
    }

    function renderTextField(title: string, defaultValue: string, key: string, width: string)
    {
        function onTextChanged(evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>)
        {
            const payload: { [key: string]: string} = {}
            payload[key] = evt.target.value;
            serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, payload)
        }
        return <TextField id="outlined-basic" label={title} variant="outlined" defaultValue={defaultValue} style={{ width, paddingBottom: 10, paddingTop: 10 }} onBlur={(evt) => onTextChanged(evt)}/>
    }

    function onStepsChanged(steps: string[])
    {
        serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, { steps: JSON.stringify(steps) })
    }

    function deleteFeature()
    {
        serverAPI<IFeature[]>(API.Features, HTTP.DELETE, props.feature.id);
        setDeleteDialogOpen(false);
        props.onDeleted();
    }

    return <>
        <span style={props.style}>
        <Tabs
            value={tab}
            onChange={(evt, value) => setTab(value)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example">
            <Tab icon={<SettingsIcon />} aria-label="Settings" label="Settings" />
            <Tab icon={<StarIcon />} aria-label="Rating" label="Rating" />
            <Tab icon={<AssignmentTurnedInIcon />} aria-label="Results" label="Results" />
        </Tabs>
        <div hidden={tab !== 0}>
            <h3>Settings</h3>
            <h4>Feature</h4>
            {renderTextField("Feature Name", props.feature.name, "name", "40%")}
            {renderTextField("Description", props.feature.description, "description", "90%")}
            <div>
                <button style={{ float: "right" }} className="success" onClick={() => null}>Save</button>
            </div>
            <h4>Steps</h4>
            <p>Define the steps to follow to test this feature</p>
            <Steps steps={props.feature.steps || [""]} onChanged={onStepsChanged}/>
            <h4>Delete Feature</h4>
            <p>Permanently delete this feature, <b>this cannot be undone</b>.</p>
            <div>
                <button className="danger" onClick={() => setDeleteDialogOpen(true)}>Delete Feature</button>
            </div>
        </div>
        <div hidden={tab !== 1}>
            <h3>Importance<div className="info">How core is this feature to your product</div></h3>
            {renderCombinedRating("Frequency of use", "use_frequency", "Severity", "severity", "Risk", setRiskRating)}
            {renderCombinedRating("Distinctness", "distinctness", "Fix Priority", "fix_priority", "Value", setValueRating)}
            <h4>Automation<div className="info">Is it worth our time to automate</div></h4>
            {renderCombinedRating("Time Cost", "time_cost", "Ease", "ease", "Efficiency", setEfficiencyRating)}
            {renderCombinedRating("Similar Problem Frequency", "similar_problem_frequency", "Problem Frequency", "problem_frequency", "Volatility", setVolatilityRating)}
            <h4>Summary</h4>

            <span>This feature is {riskRating > 3 ? "high" : "low"} risk, </span>
            <span>{valueRating > 3 ? "very" : "not very"} valuable to test, </span>
            <span>{efficiencyRating > 3 ? "easy" : "difficult"} to write automated tests for </span>
            <span>and {volatilityRating > 3 ? "a" : "not a"} common area for problems, </span>
            <span>as such we would recommend {getRecommendation()}</span>
            <div>
                <SimpleRating key="primary" title={"Priority Score"} initialValue={priorityRating} disabled={true}/>
                {/* <button style={{ float: "right" }} onClick={saveFeature}>Save Changes</button> */}
            </div>
        </div>
        <div hidden={tab !== 2}>
            <Results feature={props.feature} />
        </div>
    </span>
    <DeleteDialog targetType="Feature" deleteTargetText="any results associated with it" open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onSubmit={deleteFeature}/>
    </>
}