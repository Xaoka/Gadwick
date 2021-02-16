import { CircularProgress } from '@material-ui/core';
import React from 'react';

export default function Loading()
{
    return <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", left: "calc(50% - 20px)", top: "calc(50% - 20px)", textAlign: "center" }}>
            <CircularProgress/>
            <p>Loading...</p>
        </div>
    </div>
}