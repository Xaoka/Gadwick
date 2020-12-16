import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import StatBox from './Stats/StatBox';
import CategoryIcon from '@material-ui/icons/Category';
import { useAuth0 } from "@auth0/auth0-react";
import QuickSetup from './QuickSetup';
import ToDo from './ToDo';
import ProfileGraphs from './Stats/ProfileGraphs';

export default function Overview(props: { style?: CSSProperties, children?: React.ReactNode })
{
    const { user } = useAuth0();
    
    return <span style={props.style}>
        <h1>Profile</h1>
        <h2>{user.name}</h2>
        <div style={{ display: "flex", padding: 0 }}>
            <span style={{ padding: 25, flex: 2, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <ProfileGraphs />
            </span>
            <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <ToDo/>
            </span>
            <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <QuickSetup/>
            </span>
        </div>
        {/* <div className="subtitle">Features</div>
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()} */}
    </span>
}