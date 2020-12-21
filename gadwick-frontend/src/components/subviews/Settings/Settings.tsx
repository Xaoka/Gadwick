import { useAuth0 } from '@auth0/auth0-react';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import serverAPI, { API, HTTP } from '../../../apis/api';
import getUserID from '../../../apis/user';
import SubView from '../SubView';

interface IUser
{
    id: string;
    name: string;
}

export default function Settings()
{
    const { user } = useAuth0();
    const [gadwickUser, setGadwickUser] = useState<IUser|null>(null);

    useEffect(() => {
        getUserID(user.sub).then((id?: string) =>
        {
            serverAPI<IUser>(API.Users, HTTP.READ, id).then(setGadwickUser);
        });
    }, [])

    function card(title: string, img: string, price: string, summary: string, features: string[])
    {
        return <div style={{display: "grid", gridTemplateColumns: "auto 300px 180px", boxShadow: "grey 0px 0px 11px -2px", padding: 30, marginTop: 25, marginBottom: 25 }}>
            <div>
                <div style={{ color: "var(--theme-primary)", fontSize: 50 }}>
                    {title}
                </div>
                <p>{summary}</p>
                <ul>
                    {features.map((f) => <li>{f}</li>)}
                </ul>
            </div>
            <div style={{ margin: "auto" }}>
                <div style={{ fontSize: 90, textAlign: "center"  }}>
                    {price}
                </div>
                <div className="info" style={{ textAlign: "center" }}>
                    Per Month
                </div>
            </div>
            <img src={`/tiers/${img}.png`} width={180} height={180}/>
        </div>
    }

    return <SubView title="Settings">
        <h2>Account Settings</h2>
        <p>
            Configure your account settings.
        </p>
        <TextField defaultValue={gadwickUser?.name} label="Name"/>
        {/** Icon? */}
        <div>
            <button>Save</button>
        </div>
        <h2>Subscription Settings</h2>
        {card("Free", "tier_1", "£0", "Try Gadwick for free, perfect for trying it out.", ["Access to all of Gadwick's features", "Up to two applications", "Up to one additional collaborator per application"])}
        {card("Standard", "free_tier", "£10", "The standard Gadwick package for professionals and small teams.", ["Access to all of Gadwick's features", "Up to ten applications", "Up to five additional collaborator per application"])}
        {card("Premium", "tier_2", "£50", "Ideal for companies with a range of products or a full QA team.", ["Access to all of Gadwick's features", "Unlimited applications", "Unlimited collaborators per application"])}
    </SubView>
}