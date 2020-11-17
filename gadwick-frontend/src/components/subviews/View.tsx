import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';

export interface IView
{
    pages:
    {
        icon: OverridableComponent<SvgIconTypeMap>;
        subView: React.ReactElement;
    }[];
    sidebarScale: number;
}

export default function View(props: IView)
{
    const [activeIndex, setActiveIndex] = useState(0);
    
    return <span style={{ display: "flex", height: "100%", flexDirection: "row" }}>
        <Sidebar options={ props.pages.map((page) => { return { icon: page.icon, callback: setActiveIndex }}) } scale={props.sidebarScale}/>
        <div style={{flex: 5, paddingLeft: 20, height: "100%", overflowX: "scroll"}}>
            {props.pages[activeIndex].subView}
        </div>
    </span>
}