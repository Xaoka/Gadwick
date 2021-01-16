import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import SimpleRating, {ISimpleRating} from './SimpleRating';

interface ICombinedRating
{
    primaryRating: ISimpleRating;
    secondaryRating: ISimpleRating;
    resultRatingTitle: string;
    resultRatingToolTip: string;
    onResultChanged?: (primaryRating: number, secondaryRating: number, resultRating: number) => void;
}

export default function CombinedRating(props: ICombinedRating)
{
    const [primaryRating, setPrimaryRating] = useState(props.primaryRating.initialValue);
    const [secondaryRating, setSecondaryRating] = useState(props.secondaryRating.initialValue);
    const [resultRating, setResultRating] = useState(transformRating(props.primaryRating.initialValue, props.secondaryRating.initialValue));

    function transformRating(rating1: number, rating2: number): number
    {
        return Math.round(Math.sqrt(rating1 * rating2));
    }

    useEffect(() => {
        const newRating = transformRating(primaryRating, secondaryRating);
        setResultRating(newRating);
        if (props.onResultChanged)
        {
            props.onResultChanged(primaryRating, secondaryRating, newRating);
        }
    // eslint-disable-next-line
    }, [primaryRating, secondaryRating]);

    return <div style={{ display: "grid", gridTemplateColumns: "33% 33% 33%" }}>
        <SimpleRating key="primary" title={props.primaryRating.title} toolTip={props.primaryRating.toolTip} initialValue={primaryRating} onChanged={setPrimaryRating} />
        <SimpleRating key="secondary" title={props.secondaryRating.title} toolTip={props.secondaryRating.toolTip} initialValue={secondaryRating} onChanged={setSecondaryRating} />
        <SimpleRating key="result" title={props.resultRatingTitle} toolTip={props.resultRatingToolTip} initialValue={resultRating} disabled={true} style={{ textAlign: "right" }}/>
    </div>
}