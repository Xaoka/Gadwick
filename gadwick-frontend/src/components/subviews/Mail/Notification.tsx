import React from 'react';

export interface INotification
{
    title: string;
    date: string;
    body: string;
}

export default function Notification(props: INotification)
{
    return <div style={{ boxShadow: "grey 3px 3px 11px -4px", padding: 20 }}>
        <h2>{props.title} <p style={{ float: "right" }} className="info">{props.date}</p></h2>
        <p>{props.body}</p>
    </div>
}