import React, { CSSProperties } from 'react';
import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface IStatBox
{
    icon: OverridableComponent<SvgIconTypeMap>;
    label: string;
    value: number;
    style?: CSSProperties;
    onClick?: () => void;
}

export default function StatBox(props: IStatBox)
{
    function formatValue(value: number)
    {
        if (value < 1000) { return value }
        if (value < 1000000) { return `${(value / 1000).toFixed(1)}k` }
        else { return `${(value / 1000000).toFixed(1)}m` }
    }

    return <div className="stat-box" style={props.style} onClick={props.onClick}>
        <div style={{ padding: 20, paddingLeft: 20, paddingRight: 20, alignContent: "center" }}>
            <props.icon style={{ borderRadius: 100, borderColor: "transparent", backgroundColor: "#b2c4ed", padding: 10, textAlign: "center", marginLeft: 35 }} fontSize="small"/>
            <h3 style={{ margin: "auto", textAlign: "center", paddingLeft: 0 }}>{formatValue(props.value)}</h3>
            <div className="info" style={{ margin: "auto", textAlign: "center" }}>{props.label}</div>
        </div>
    </div>
}