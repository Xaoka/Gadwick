import React from 'react';
import { useHistory } from 'react-router-dom';
import Chevron from '../../Chevron';
import SubView from '../SubView';

export default function Info()
{
    const history = useHistory();
    
    return <div style={{ margin: "auto", width: "50%", paddingTop: "5%" }}>
        <h1>Don't waste any time</h1>
        <h3>Gadwick offers insights about your products to help make sure you make the most impact.</h3>
        <div style={{ textAlign: "center" }}>
            <img src="/promos/stats.png" style={{ width: 550, height: 350 }}/>
        </div>
    </div>
    // return <SubView title="About Gadwick">
    //     <h2>Don't waste any time</h2>
    //     <p>Gadwick uses insights about your features to help make sure you make the most impact</p>
    //     <h2>Integrate easily with management tools</h2>
    //     <p>Easily import features from popular tools like JIRA or Asana and automatically submit bug tickets back to your desired boards.</p>
    //     <h2>Regression tests right in your browser</h2>
    //     <p>Start testing sessions, track the results and if you need to step away just pick right back up where you left off.</p>
    //     <h2>Automatic test code generation</h2>
    //     <p>Automatically generate the bulk of test code based on your features</p>
    //     <h2>Learn from professionals</h2>
    //     <p>Learn how to automate tests from tutorials written by professional automation engineers.</p>
    //     <button onClick={() => history.push('/signup')}>
    //         Get Started
    //         <Chevron/>
    //     </button>
    // </SubView>
}