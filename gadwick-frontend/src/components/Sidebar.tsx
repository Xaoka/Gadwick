import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React, { CSSProperties, useState } from 'react';

interface ISidebar
{
    options:
    {
        callback: (index: number) => void;
        icon: OverridableComponent<SvgIconTypeMap>;
    }[]
}

export default function Sidebar(props: ISidebar)
{
    const [activeIndex, setActiveIndex] = useState(0);

    const divStyle: CSSProperties =
    { width: "1em", height: "1em", fontSize: "2.5rem", paddingLeft: "0.08em", paddingTop: "0.08em", color: "white" }


    return <span className="sidebar">
        {props.options.map((opt, index) =>
            <div style={divStyle} className={activeIndex === index ? "selected" : ""} onClick={() => { setActiveIndex(index); opt.callback(index); }} key={index}>
                <opt.icon style={{ fontSize: "inherit" }} color="inherit"/>
            </div>
        )}
    </span>
}