import React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import QuickSetup from './QuickSetup';
// import ToDo from './ToDo';
import ProfileGraphs from './Stats/ProfileGraphs';
import SubView from '../SubView';

export default function Overview()
{   
    return <SubView title="Profile">
        {/* <h2>{user.name}</h2> */}
        <div style={{ display: "flex", padding: 0 }}>
            <span style={{ padding: 25, flex: 2, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <ProfileGraphs />
            </span>
            {/* <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <ToDo/>
            </span> */}
            <span style={{ padding: 25, flex: 1, borderRadius: 30, borderColor: "var(--theme-primary)", borderStyle: "solid", backgroundColor: "white", margin: 25 }}>
                <QuickSetup/>
            </span>
        </div>
        {/* <div className="subtitle">Features</div>
        <button style={{ color: "green", float: "right" }} onClick={createNew}>New Feature</button>
        {renderFeatureTable()} */}
    </SubView>
}