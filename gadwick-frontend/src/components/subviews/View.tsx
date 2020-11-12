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
    }[]
}

export default function View(props: IView)
{
    const [activeIndex, setActiveIndex] = useState(0);
    
    return <>
        <Sidebar options={ props.pages.map((page) => { return { icon: page.icon, callback: setActiveIndex }}) }/>
        {props.pages[activeIndex].subView}
    </>
}