import React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface IStatBox
{
    icon: OverridableComponent<SvgIconTypeMap>;
    label: string;
    value: number;
}

export default function StatBox(props: IStatBox)
{
    function formatValue(value: number)
    {
        if (value < 1000) { return value }
        if (value < 1000000) { return `${(value / 1000).toFixed(1)}k` }
        else { return `${(value / 1000000).toFixed(1)}m` }
    }

    return <div style={{ borderRadius: 15, borderColor: "transparent", backgroundColor: "#ebf1ff", width: 150, height: 150, margin: 10 }}>
        <div style={{ padding: 20, paddingLeft: 20, paddingRight: 20, alignContent: "center" }}>
            <props.icon style={{ borderRadius: 100, borderColor: "transparent", backgroundColor: "#b2c4ed", padding: 10, textAlign: "center", marginLeft: 35 }} fontSize="small"/>
            <div className="heading" style={{ margin: "auto", textAlign: "center", paddingLeft: 0 }}>{formatValue(props.value)}</div>
            <div className="info" style={{ margin: "auto", textAlign: "center" }}>{props.label}</div>
        </div>
    </div>
}