import React, { useState } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import BreadcrumbPath from '../../BreadcrumbPath';
import InfoCard, { MediaType } from '../../InfoCard';
import PrivateRoute from '../../PrivateRoute';
import Setup from './Setup';
import RobustTests from './Articles/RobustTests';
import SubView from '../SubView';
import { SubscriptionTier } from '../Subscription/Subscription';
import tutorialsData, { ITutorial } from './tutorialsData';
import tutorialData from './tutorialsData';

export default function Tutorials()
{
    let { path, url } = useRouteMatch();
    const history = useHistory();

    function openTutorial(urlExt: string)
    {
        history.push(`${url}/${urlExt}`)
    }

    function createLinks(tutorials: ITutorial[])
    {
        return tutorials.map((tutorial) =>
        {
            if (!tutorial.link) { return; }
            return <PrivateRoute path={`${path}/${tutorial.link.url}`}>
                <BreadcrumbPath baseURL={url} stages={["Browse", tutorial.title]}/>
                <div style={{ padding: 40 }}>
                    <tutorial.link.component/>
                </div>
            </PrivateRoute>
        })
    }

    function createCards(tutorials: ITutorial[])
    {
        return <div style={{ padding: 40 }}>
            {tutorials.map((tutorial: ITutorial) =>
                {
                    let image: MediaType = MediaType.AvailableSoon;
                    let link: () => any = () => null;
                    if (tutorial.link)
                    {
                        image = tutorial.mediaType || MediaType.Code;
                        link = () => openTutorial(tutorial.link!.url);
                    }
                    if (tutorial.externalLink)
                    {
                        image = tutorial.mediaType || MediaType.Application;
                        link = () => window.open(tutorial.externalLink!);
                    }
                    return <InfoCard image={image} onClick={link} title={tutorial.title} summary={tutorial.summary} subscription={tutorial.subscription} key={tutorial.title}/>
                })}
        </div>
    }

    return <SubView title="Tutorials">
        <Switch>
            {createLinks(tutorialData.basic)}
            {createLinks(tutorialData.foundational)}
            {createLinks(tutorialData.advanced)}
            
            <PrivateRoute path={path}>
                {/* <BreadcrumbPath baseURL={url} stages={["Browse"]}/> */}
                <h2>Basics</h2>
                {createCards(tutorialsData.basic)}
                <h2>Foundational</h2>
                {createCards(tutorialsData.foundational)}
                <h2>Advanced</h2>
                {createCards(tutorialsData.advanced)}
                <h2>External Links</h2>
                {createCards(tutorialsData.external)}
            </PrivateRoute>
        </Switch>
    </SubView>
}