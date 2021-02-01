import React from 'react';

interface ITutorialBox
{
    topics: string[];
}

export default function TutorialBox(props: ITutorialBox)
{
    return <div style={{ backgroundColor: "#ebf6f7", paddingBottom: 15, paddingTop: 1, borderLeftColor: `var(--theme-primary)`, borderLeftWidth: 5, borderLeftStyle: "solid" }}>
        <h3>
            <img src='/tutorials/students-cap.svg' style={{ width: 30, height: 30, verticalAlign: "middle", opacity: 0.5, padding: 10, paddingBottom: "1rem" }}/>
            Topics
        </h3>
        <div style={{ paddingLeft: 30 }}>
            This tutorial covers:
            <ul>
                {props.topics.map((topic) => <li>{topic}</li>)}
            </ul>
        </div>
    </div>
}