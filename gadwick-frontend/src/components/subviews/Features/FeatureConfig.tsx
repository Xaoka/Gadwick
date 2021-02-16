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
import Info from '../../InfoIcon';
import { useSnackbarMessages } from '../../snackbar/SnackbarContext';

interface IFeatureConfig
{
    feature: IFeature;
    style?: CSSProperties;
    onDeleted: () => void;
}

export interface ITag
{
    id: string;
    name: string;
}

export default function FeatureConfig(props: IFeatureConfig)
{
    const snackbar = useSnackbarMessages();

    const [tab, setTab] = useState<number>(0);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [riskRating, setRiskRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [efficiencyRating, setEfficiencyRating] = useState(0);
    const [volatilityRating, setVolatilityRating] = useState(0);
    const [priorityRating, setPriorityRating] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tags, setTags] = useState<ITag[]>([]);

    const [name, setName] = useState(props.feature.name);
    const [description, setDescription] = useState(props.feature.description);
    const [tag, setTag] = useState(props.feature.tag);
    // const [lastSavedScore, setLastSavedScore] = useState(0);

    function calculateRisk()
    {
        return Math.ceil((riskRating + valueRating + efficiencyRating + volatilityRating) / 4);
    }

    useEffect(() => {
        serverAPI<ITag[]>(API.AppTags, HTTP.READ, props.feature.app_id).then(setTags);
    }, [])

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

    function renderCombinedRating(primaryTitle: string, primaryKey: keyof IFeatureRatings, primaryTip: string, secondaryTitle: string, secondaryKey: keyof IFeatureRatings, secondaryTip: string, resultTitle: string, resultTip: string, setRating: (val: number) => void)
    {
        function onResultChanged(primaryRating: number, secondaryRating: number, resultRating: number)
        {
            setRating(resultRating);
            const newRatings = {...ratings}
            newRatings[primaryKey] = primaryRating;
            newRatings[secondaryKey] = secondaryRating;
            setRatings(newRatings);
        }
        return <CombinedRating primaryRating={{ title: primaryTitle, initialValue: props.feature[primaryKey] as any, toolTip: primaryTip }} secondaryRating={{ title: secondaryTitle, toolTip: secondaryTip, initialValue: props.feature[secondaryKey] as any }} resultRatingTitle={resultTitle} resultRatingToolTip={resultTip} onResultChanged={onResultChanged}/>
    }

    function renderTextField(title: string, defaultValue: string, onChanged: (value: string) => void, width: string)
    {
        return <TextField
            id="outlined-basic"
            label={title}
            variant="outlined"
            defaultValue={defaultValue}
            style={{ width, paddingBottom: 10, paddingTop: 10 }}
            onChange={(evt) => onChanged(evt.target.value)}/>
    }

    async function onFeatureSaved()
    {
        await serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, { name, description, tag });
        snackbar?.sendSnackbarMessage("Feature Saved", "success");
    }

    async function onRatingsSaved()
    {
        await serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, ratings);
        snackbar?.sendSnackbarMessage("Feature Saved", "success");
    }

    async function onStepsChanged(steps: string[])
    {
        await serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature.id, { steps: JSON.stringify(steps) })
        snackbar?.sendSnackbarMessage("Feature Saved", "success");
    }

    async function deleteFeature()
    {
        await serverAPI<IFeature[]>(API.Features, HTTP.DELETE, props.feature.id);
        setDeleteDialogOpen(false);
        props.onDeleted();
        snackbar?.sendSnackbarMessage("Feature Deleted", "success");
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
            {renderTextField("Feature Name", props.feature.name, setName, "40%")}
            {renderTextField("Description", props.feature.description, setDescription, "90%")}
            <div>
                <span>Tag </span>
                <select style={{ width: 100 }} onChange={(evt) => setTag(evt.target.value)} value={tag}>
                    <option>-</option>
                    {tags.map((t) => <option value={t.id}>{t.name}</option>)}
                </select>
                <Info title="Each application can have a range of tags for categorizing features." style={{ verticalAlign: "middle" }}/>
            </div>
            <div>
                <button style={{ float: "right" }} className="success" onClick={onFeatureSaved}>Save</button>
            </div>
            <h4>Steps</h4>
            <p>Define the steps to follow to test this feature</p>
            <Steps steps={props.feature.steps?.length > 0 ? props.feature.steps : [""]} onChanged={onStepsChanged}/>
            <h4>Delete Feature</h4>
            <p>Permanently delete this feature, <b>this cannot be undone</b>.</p>
            <div>
                <button className="danger" onClick={() => setDeleteDialogOpen(true)}>Delete Feature</button>
            </div>
        </div>
        <div hidden={tab !== 1}>
            <h3>Ratings</h3>
            {renderCombinedRating("Frequency of use", "use_frequency", "How often this feature is used, higher rating is more frequent", "Severity", "severity", "How much of an impact will problems with this feature cause", "Risk", "Calculated risk associated with the feature", setRiskRating)}
            {renderCombinedRating("Distinctness", "distinctness", "How much of this feature is not covered by other tests or features", "Fix Priority", "fix_priority", "How urgent is the feature to fix", "Value", "Calculated value of testing the feature", setValueRating)}
            {/* <h4>Automation<div className="info">Is it worth our time to automate</div></h4> */}
            {renderCombinedRating("Time Cost", "time_cost", "How much time will it take to write a test for this feature, higher is faster", "Ease", "ease", "How easy would it be to write a test for this feature", "Efficiency", "Efficiency of writing a test for this feature", setEfficiencyRating)}
            {renderCombinedRating("Similar Problem Frequency", "similar_problem_frequency", "How often similar features have problems", "Problem Frequency", "problem_frequency", "How often this feature has problems", "Volatility", "Calculated volatility of the feature", setVolatilityRating)}
            <h4>Summary</h4>

            <span>This feature is {riskRating > 3 ? "high" : "low"} risk, </span>
            <span>{valueRating > 3 ? "very" : "not very"} valuable to test, </span>
            <span>{efficiencyRating > 3 ? "easy" : "difficult"} to write automated tests for </span>
            <span>and {volatilityRating > 3 ? "a" : "not a"} common area for problems, </span>
            <span>as such we would recommend {getRecommendation()}</span>
            <div>
                <SimpleRating key="primary" title={"Priority Score"} toolTip={"How important it is to write an automated test for this feature"} initialValue={priorityRating} disabled={true}/>
            </div>
            <div>
                <button style={{ float: "right" }} className="success" onClick={onRatingsSaved}>Save</button>
            </div>
        </div>
        <div hidden={tab !== 2}>
            <Results feature={props.feature} />
        </div>
    </span>
    <DeleteDialog targetType="Feature" deleteTargetText="any results associated with it" open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onSubmit={deleteFeature}/>
    </>
}