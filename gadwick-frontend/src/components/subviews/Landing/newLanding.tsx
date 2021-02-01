import React, { useEffect } from 'react';
import octopus from '../../../imgs/gadwick_octopus.jpg';
import stats from '../../../imgs/stats.png';
import sessions from '../../../imgs/sessions.png';
import features from '../../../imgs/features.png';
import tutorials from '../../../imgs/tutorials.png';
import logo from '../../../imgs/gadwick_icon.png';
import npm from '../../../imgs/npm.png';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import Chevron from '../../Chevron';

export default function LandingPage()
{
    const history = useHistory();
    const { loginWithRedirect, isAuthenticated, logout, user, isLoading } = useAuth0();

    useEffect(() => {
        if (isAuthenticated && !isLoading && window.location.pathname !== "/auth-redirect")
        {
            history.push("/dashboard/overview");
        }
    }, [isAuthenticated, isLoading])
    const pages: { heading: string, subheading: string, img: string }[] =
    [
        {
            heading: "Move away from unmanageable spreadsheets",
            subheading: "No more losing track of what you need to test or who's working on it, easily manage it all in one place.",
            img: octopus
        },
        {
            heading: "Get impactful insights",
            subheading: "Quickly identify what tests to automate, find flakey features and explore other statistics about your tests to make the most impact.",
            img: stats
        },
        {
            heading: "Get set up in just a few clicks",
            subheading: "Easily import features from popular tools like JIRA or Asana and automatically submit bug tickets back to your desired boards.",
            img: features
        },
        {
            heading: "Sessions made simple",
            subheading: "Gadwick provides testing sessions that are tailored to your needs, with options to run regression tests, exploratory tests and more.",
            img: sessions
        },
        {
            heading: "Learn from the best",
            subheading: "Gadwick provides articles and tutorials covering a massive range of topics, written by QA Automation professionals, helping you write better tests and learn new technologies to accelerate your career.",
            img: tutorials
        },
        {
            heading: "Generate test suites",
            subheading: "Gadwick provides plugins for your favourite testing frameworks, allowing you to generate code for test suites automatically from features and requirements.",
            img: npm
        }
    ]
    return <div style={{ padding: 60, paddingTop: 120 }}>
        <h1>No more spreadsheets, learn how to manage and automate tests the right way.</h1>
        <h2>Easily go from product requirements to testing,  managed all in one place.</h2>
        <button onClick={() => loginWithRedirect()}>
            Get Started<Chevron/>
        </button>

        {pages.map((page, index) => <div style={{ paddingTop: 80, paddingBottom: 80, display: "grid", gridTemplateColumns: "50% 50%" }}>
            <div style={{ marginTop: "auto", marginBottom: "auto", order: (index % 2) }}>
                <h2>{page.heading}</h2>
                <p style={{ color: "var(--theme-primary)", paddingLeft: 30 }}>{page.subheading}</p>
            </div>
            <img src={page.img} alt="Feature Stats Preview" style={{ display: "inline-block", width: "90%", order: 1-(index%2), padding: 20 }}/>
        </div>)}
        <div style={{ paddingTop: 80, paddingBottom: 80, display: "grid", gridTemplateColumns: "50% 50%" }}>
            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                <h2>Get started today for free</h2>
                <p style={{ color: "var(--theme-primary)", paddingLeft: 30 }}>Get started completely free and have access to all of Gadwick's features.</p>
            </div>
            <button onClick={() => loginWithRedirect()}>
                Get Started<Chevron/>
            </button>
        </div>
    </div>
}