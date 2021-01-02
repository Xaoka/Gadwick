import React, { CSSProperties, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Route, useHistory } from 'react-router-dom';
import octopus from '../../../imgs/gadwick_octopus.jpg';
import stats from '../../../imgs/stats.png';
import sessions from '../../../imgs/sessions.png';
import features from '../../../imgs/features.png';
import tutorials from '../../../imgs/tutorials.png';
import free_preview from '../../../imgs/free_preview.png';
import npm from '../../../imgs/npm.png';
import Chevron from '../../Chevron';
import { Fade } from '@material-ui/core';

export default function Landing()
{
    const history = useHistory();
    const { loginWithRedirect, isAuthenticated, logout, user, isLoading } = useAuth0();
    const [page, setPage] = useState<number>(0);
    
    const logoPosition: CSSProperties =
    {
        margin: "auto",
        // marginTop: "25%",
        verticalAlign: "middle",
        // height: "100%",
        display: "inline-block",
        maxWidth: "50%",//564,
        flexGrow: 3,
        marginTop: "10%"
    }

    useEffect(() => {
        if (isAuthenticated && !isLoading)
        {
            history.push("/dashboard/overview");
        }
    }, [isAuthenticated, isLoading])

    const pages: { heading: string, subheading: string, img: string }[] =
    [
        {
            heading: "Gadwick",
            subheading: "Get your business all on one page and start automating your tests, without breaking a sweat.",
            img: octopus
        },
        {
            heading: "Impactful Insights",
            subheading: "Gadwick offers insights about your products to help make sure you make the most impact.",
            img: stats
        },
        {
            heading: "Easy Integration",
            subheading: "Easily import features from popular tools like JIRA or Asana and automatically submit bug tickets back to your desired boards.",
            img: features
        },
        {
            heading: "Test in your browser",
            subheading: "Start testing sessions, track the results and if you need to step away just pick right back up where you left off.",
            img: sessions
        },
        {
            heading: "Learn from professionals",
            subheading: "Learn how to automate tests from tutorials written by professional automation engineers.",
            img: tutorials
        },
        {
            heading: "Code Generation",
            subheading: "Generate test suites quickly from product requirements",
            img: npm
        },
        {
            heading: "Start Today",
            subheading: "Get started today for free.",
            img: octopus
        }
    ]

    return <div style={{ display: "flex", marginLeft: 60, marginRight: 60 }}>
        <div style={{ flexGrow: 7, verticalAlign: "middle", height: "100%", marginTop: "15%", marginLeft: 60 }}>
            <div style={{ height: 300 }}>
                <h1>{pages[page].heading}</h1>
                {/* <h2>Get automated, get confident.</h2> */}
                <h3 style={{ paddingLeft: 30, display: "contents" }}>
                    {pages[page].subheading}
                </h3>
            </div>
            <div style={{ paddingLeft: 120, paddingTop: 30 }}>
                {page < pages.length - 1 && <button onClick={() => setPage(((p) => p+1))}>
                    Learn More<Chevron/>
                </button>}
                <button onClick={() => loginWithRedirect()}>
                    Get Started<Chevron/>
                </button>
            </div>
        </div>
        <img src={pages[page].img} alt="Gadwick Octopus Logo" style={logoPosition}/>
    </div>
}