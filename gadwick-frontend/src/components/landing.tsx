import React, { CSSProperties, useEffect } from 'react';
import octopus from '../imgs/gadwick_octopus.jpg';
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from 'react-router-dom';

export default function Landing()
{
    const { isAuthenticated, isLoading } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated && !isLoading)
        {
            history.push("/dashboard");
        }
    }, [isAuthenticated, isLoading])

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