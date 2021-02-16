import { Tabs, Tab } from '@material-ui/core';
import React, { useState } from 'react';
import SubView from '../SubView';
import PeopleIcon from '@material-ui/icons/People';
import StoreIcon from '@material-ui/icons/Store';
import AppsIcon from '@material-ui/icons/Apps';
import Users from './Users';
import Sales from './Sales';
import UserApps from './UserApps'

export default function Admin()
{
    const [tab, setTab] = useState<number>(0);

    return <SubView title="Admin">
        Local only site administration.
        <Tabs
            value={tab}
            onChange={(evt, value) => setTab(value)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example">
            <Tab icon={<PeopleIcon />} aria-label="Users" label="Users" />
            <Tab icon={<StoreIcon />} aria-label="Sales" label="Sales" />
            <Tab icon={<AppsIcon />} aria-label="User Apps" label="User Apps" />
        </Tabs>
        <div hidden={tab !== 0}>
            <Users/>
        </div>
        <div hidden={tab !== 1}>
            <Sales/>
        </div>
        <div hidden={tab !== 2}>
            <UserApps/>
        </div>
    </SubView>
}