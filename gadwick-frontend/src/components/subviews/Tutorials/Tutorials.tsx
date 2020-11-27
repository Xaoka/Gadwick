import React from 'react';
import TutorialCard from './TutorialCard';

export default function Tutorials()
{
    return <>
        <div className="title">Tutorials</div>
        <div className="subtitle">Learn more about automation</div>
        <div style={{ padding: 40 }}>
            <TutorialCard title="Setting up Gadwick" summary="Learn how to integrate your test suites with Gadwick."/>
            <TutorialCard title="Writing robust tests" summary="Learn how to write tests that don't break every time you change something."/>
            <TutorialCard title="Continuous Integration" summary="Learn about the methodology of CI and how to get started."/>
        </div>
    </>
}