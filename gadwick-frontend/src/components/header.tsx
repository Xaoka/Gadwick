import React, { CSSProperties } from 'react';

export interface IHeader
{
    onClick: () => void;
    loggedIn: boolean;
}

export default function Header(props: IHeader)
{
    const text = props.loggedIn ? "Log Out" : "Log In";
    return <>
        <button style={{ position: "absolute", top: 15, right: 15 }} onClick={props.onClick}>{text}</button>
    </>
}