import React from 'react';
import update from '../../../imgs/update.jpg';

export interface INotification
{
    title: string;
    date: string;
}

export default function Notification(props: React.PropsWithChildren<INotification>)
{
    return <div style={{ boxShadow: "grey 3px 3px 11px -4px", padding: 20, marginTop: 20 }}>
        <h2>{props.title} <p style={{ float: "right" }} className="info">{props.date}</p></h2>
        <div style={{ display: "grid", gridTemplateColumns: "200px auto"}}>
            <img src={update} style={{ width: 200, height: 200, display: "inline" }}/>
            <div>
                {props.children}
            </div>
        </div>
    </div>
}