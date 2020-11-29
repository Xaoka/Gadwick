import React from 'react';
import { IConfiguredApplication } from '../Applications/Applications';
import Snippets from './Snippets';

export default function Setup(props: { app: IConfiguredApplication })
{
    return <>
        <div className="subtitle">Testing with Gadwick</div>
        <p>Testing with Gadwick is simple and fits right into your existing test suites.</p>
        <Snippets app={props.app}/> {/** TODO: User to select the app for the tutorial */}
    </>
}