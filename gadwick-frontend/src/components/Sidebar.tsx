import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React, { CSSProperties, useState } from 'react';

interface ISidebar
{
    options:
    {
        callback: (index: number) => void;
        icon: OverridableComponent<SvgIconTypeMap>;
        buttonID: string;
    }[];
    scale: number;
    selected: number;
}
// TODO: Replace with tabs https://material-ui.com/components/tabs/
export default function Sidebar(props: ISidebar)
{
    const divStyle: CSSProperties =
    { width: `${props.scale}em`, height: `${props.scale}em`, fontSize: `${props.scale * 2.5}rem`, paddingLeft: `${props.scale * 0.08}em`, paddingTop: `${props.scale * 0.08}em`, color: "white" }


    return <span className="sidebar">
        {props.options.map((opt, index) =>
            <div style={divStyle} className={props.selected === index ? "selected" : ""} onClick={() => { opt.callback(index); }} key={index}>
                <opt.icon style={{ fontSize: "inherit" }} color="inherit"/>
            </div>
        )}
    </span>
}