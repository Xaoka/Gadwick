import React from 'react'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export default function ToDo()
{
    function Done(props: {isDone: boolean, label: string})
    {
        const baseStyle: CSSProperties =
        {
            verticalAlign: "top",
            paddingLeft: 10
        }
        if (props.isDone)
        {
            return <div>
                <CheckCircleOutlineIcon/>
                <span style={{ ...baseStyle, textDecoration: "line-through" }}>
                    {props.label}
                </span>
            </div>
        }
        else
        {
            return <div>
                <RadioButtonUncheckedIcon/>
                <span style={baseStyle}>
                    {props.label}
                </span>
            </div>
        }
    }

    return <>
        <h2>Getting Started</h2>
        <h4>Setup</h4>
        <Done isDone={true} label="Create your first app"/>
        <Done isDone={false} label="Add a feature"/>
        <Done isDone={false} label="Configure a feature"/>
        <h4>Testing</h4>
        <Done isDone={false} label="Add Gadwick to your test suite"/>
        <Done isDone={false} label="Run your tests with the Gadwick reporter"/>
    </>
}