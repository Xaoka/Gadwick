import React from 'react';

export interface IPackageCard
{
    data: IPackageCardData;
    selected: boolean;
    onClick: () => void;
}

export interface IPackageCardData
{
    title: string;
    img: string;
    price: string;
    price_in_pence: number;
    summary: string;
    features: string[];
    backgroundColours:
    {
        midColour: string;
        bottomColor: string;
    };
};

export default function PackageCard(props: IPackageCard)
{
    const background = `linear-gradient(0deg, ${props.data.backgroundColours.bottomColor} 0%, ${props.data.backgroundColours.midColour} 16%, rgba(255,255,255,1) 100%)`;
    const border = props.selected ? `${props.data.backgroundColours.bottomColor} solid 10px` : ``;
    const padding = props.selected ? 20 : 30;

    return <span style={{ boxShadow: "grey 0px 0px 11px -2px", padding: padding, marginLeft: 25, marginRight: 25, background: background, border: border, position: "relative" }}
            onClick={props.onClick}>
        <div style={{ color: "var(--theme-primary)", fontSize: 50, textAlign: "center" }}>
            {props.data.title}
        </div>
        <div style={{ color: "grey", fontSize: "small", textAlign: "center" }}>
            {props.selected ? "Current Plan" : "Click to purchase"}
        </div>
        <img src={`/tiers/${props.data.img}.png`} width={180} height={180} style={{ marginLeft: "calc(50% - 90px)" }}/>
        <div>
            <p>{props.data.summary}</p>
            <ul>
                {props.data.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
        </div>
        <div style={{ margin: "auto" }}>
            <div style={{ fontSize: 90, textAlign: "center", textShadow: "1px 1px 5px grey" }}>
                {props.data.price}
            </div>
            <div className="info" style={{ textAlign: "center" }}>
                Per Month
            </div>
        </div>
        {/* {props.selected && <div style={{ position: "absolute", top: 10, right: 10, backgroundColor: "white", boxShadow: "grey 0px 2px 4px -2px", padding: 5, borderRadius: 5 }}>
            Current Plan
        </div>} */}
    </span>
}