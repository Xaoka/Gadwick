import React, { useState } from 'react';
import { useEffect } from 'react';
import serverAPI, { API, HTTP } from '../apis/api';
import CombinedRating from './CombinedRating';
import { IFeature, IFeatureRatings } from './overview';
import SimpleRating from './SimpleRating';

export default function FeatureConfig(props: { feature: IFeature })
{
    const [riskRating, setRiskRating] = useState(0);
    const [valueRating, setValueRating] = useState(0);
    const [efficiencyRating, setEfficiencyRating] = useState(0);
    const [volatilityRating, setVolatilityRating] = useState(0);
    const [priorityRating, setPriorityRating] = useState(0);
    // const [lastSavedScore, setLastSavedScore] = useState(0);

    function calculateRisk()
    {
        return Math.ceil((riskRating + valueRating + efficiencyRating + volatilityRating) / 4);
    }

    useEffect(() => {
        setPriorityRating(calculateRisk());
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
            serverAPI<IFeature[]>(API.Features, HTTP.UPDATE, props.feature["feature-id"], payload)
        }
        return <CombinedRating primaryRating={{ title: primaryTitle, initialValue: props.feature[primaryKey] }} secondaryRating={{ title: secondaryTitle, initialValue: props.feature[secondaryKey] }} resultRatingTitle={resultTitle} onResultChanged={onResultChanged}/>
    }    

    return <>
        <div className="subheading">General<div className="info">How important is this feature to your product</div></div>
        {renderCombinedRating("Frequency of use", "use_frequency", "Severity", "severity", "Risk", setRiskRating)}
        {renderCombinedRating("Distinctness", "distinctness", "Fix Priority", "priority", "Value", setValueRating)}
        <div className="subheading">Automation<div className="info">Is it worth our time to automate</div></div>
        {renderCombinedRating("Time Cost", "cost", "Ease", "ease", "Efficiency", setEfficiencyRating)}
        {renderCombinedRating("Similar Problem Frequency", "similar_frequency", "Problem Frequency", "problem_frequency", "Volatility", setVolatilityRating)}
        <div className="subheading">Summary</div>

        <span>This feature is {riskRating > 3 ? "high" : "low"} risk, </span>
        <span>{valueRating > 3 ? "very" : "not very"} valuable to test, </span>
        <span>{efficiencyRating > 3 ? "easy" : "difficult"} to write automated tests for </span>
        <span>and {volatilityRating > 3 ? "a" : "not a"} common area for problems, </span>
        <span>as such we would recommend {getRecommendation()}</span>
        <div>
            <SimpleRating key="primary" title={"Priority Score"} initialValue={priorityRating} disabled={true}/>
            {/* <button style={{ float: "right" }} onClick={saveFeature}>Save Changes</button> */}
        </div>
    </>
}