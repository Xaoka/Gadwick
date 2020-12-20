import React, { CSSProperties } from 'react';

interface IFeaturePriority
{
    priority: number;
}

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
        color: "black",
        padding: "0.25em"
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

export default function FeaturePriority(props: IFeaturePriority)
{
    return <span style={scoreStyling(props.priority)}>
        {props.priority}
    </span>
}