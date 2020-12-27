import { Tooltip } from '@material-ui/core';
import React, { CSSProperties } from 'react';

interface IFeaturePriority
{
    priority: number;
}

function scoreStyling(score: number): CSSProperties
{
    // TODO: Figure out why this CSS behaves differently between quick setup and features
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
        padding: "0.5em",
        // paddingTop: "em",
        fontSize: "0.75rem",
        // boxSizing: "content-box",
        // paddingLeft: `${0.25 + (0.25 * (3-score.toString().length))}em`,
        // paddingRight: `${0.25 + (0.25 * (3-score.toString().length))}em`
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

function getTextRating(score: number): string
{
    if (score > 55)
    {
        return "high"
    }
    else if (score > 45)
    {
        return "moderate"
    }
    else if (score > 25)
    {
        return "low"
    }
    else
    {
        return "very low"
    }
}

export default function FeaturePriority(props: IFeaturePriority)
{
    let toolTip = "";
    if (props.priority > 0)
    {
        toolTip = `This feature has a ${getTextRating(props.priority)} priority for automation testing.`;
    }
    else
    {
        toolTip = "This feature has not been configured yet."
    }
    return <Tooltip title={toolTip}>
        <span style={scoreStyling(props.priority)}>
            {props.priority}
        </span>
    </Tooltip>
}