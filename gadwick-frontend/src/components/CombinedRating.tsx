import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import SimpleRating, {ISimpleRating} from './SimpleRating';

interface ICombinedRating
{
    primaryRating: ISimpleRating;
    secondaryRating: ISimpleRating;
    resultRatingTitle: string;
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
    }, [primaryRating, secondaryRating]);

    return <div>
        <SimpleRating key="primary" title={props.primaryRating.title} initialValue={primaryRating} onChanged={setPrimaryRating} />
        <SimpleRating key="secondary" title={props.secondaryRating.title} initialValue={secondaryRating} onChanged={setSecondaryRating} />
        <SimpleRating key="result" title={props.resultRatingTitle} initialValue={resultRating} disabled={true} style={{ float: "right" }}/>
    </div>
}