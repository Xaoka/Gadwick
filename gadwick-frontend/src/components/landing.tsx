import React, { CSSProperties } from 'react';
import octopus from '../imgs/gadwick_octopus.jpg';

export default function Landing()
{
    const titlePosition: CSSProperties =
    {
        position: "absolute",
        top: "50%",
        left: "25%",
        transform: "translate(-50%, -50%)"
    }
    const logoPosition: CSSProperties =
    {
        position: "absolute",
        top: "50%",
        right: "5%",
        transform: "translate(0%, -50%)"
    }

    return <>
    <div style={{ ...titlePosition }}>
        <div className="title">Gadwick</div>
        <div className="subtitle">Get automated, get confident.</div>
    </div>
    <img src={octopus} alt="Gadwick Octopus Logo" style={{ ...logoPosition}}/>
    </>
}