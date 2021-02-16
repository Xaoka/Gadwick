import React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import QuickSetup from './QuickSetup';
// import ToDo from './ToDo';
import ProfileGraphs from './Stats/ProfileGraphs';
// import QuickStart from '../QuickStart/QuickStart';
import SubView from '../SubView';

export default function Overview()
{   
    return <SubView title="Overview">
        <h2>Welcome to your all in one platform for managing and improving your quality assurance process!</h2>
        <div style={{ display: "flex", padding: 0 }}>
            <span style={{ padding: 25, flex: 2, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <ProfileGraphs />
            </span>
            <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <QuickSetup/>
            </span>
        </div>
    </SubView>
}