import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React, { useEffect, useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import Sidebar from '../Sidebar';

export interface IView
{
    pages:
    {
        icon: OverridableComponent<SvgIconTypeMap>;
        subView: React.ReactElement;
        buttonID: string;
        pageURL: string;
    }[];
    sidebarScale: number;
}

export default function View(props: IView)
{
    const history = useHistory();
    let { path, url } = useRouteMatch();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // TODO: Find a cleaner way of doing this
        for (let i = 0; i < props.pages.length; i++)
        {
            if (window.location.pathname.includes(props.pages[i].pageURL))
            {
                setActiveIndex(i);
                return;
            }
        }
    }, [])

    function onPageChanged(index: number)
    {
        history.push(`${url}/${props.pages[index].pageURL}`);
        setActiveIndex(index);
    }
    
    return <span style={{ display: "flex", height: "100%", flexDirection: "row" }}>
        <Sidebar options={ props.pages.map((page) => { return { icon: page.icon, callback: onPageChanged, buttonID: page.buttonID }}) } scale={props.sidebarScale} selected={activeIndex}/>
        <div style={{flex: 5, paddingLeft: 20, height: "100%", overflowX: "scroll"}}>
        <Switch>
            {props.pages.map((page) => <PrivateRoute path={`${path}/${page.pageURL}`} key={page.pageURL}>{page.subView}</PrivateRoute>)}
        </Switch>
        </div>
    </span>
}