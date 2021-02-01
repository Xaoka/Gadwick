import { cleanup } from '@testing-library/react';
import React, { useEffect, useState } from 'react';

export default function Authenticated()
{
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [buttonClass, setButtonClass] = useState("");

    useEffect(() => {
        if (!window.opener)
        {
            setTitle("Invalid Redirect");
            setMessage("Could not find the redirecting page, click below to close this window and return to Gadwick.");
            setButtonClass("danger");
        }
        else if (window.location.search.includes("?code="))
        {
            setTitle("Authentication Success");
            setMessage("Authentication has been successful, click below to close this window and return to Gadwick.");
            setButtonClass("success");
            window.opener.postMessage({ code: window.location.search.replace("?code=", "")});
        }
        else
        {
            setTitle("Authentication Failure");
            setMessage("Authentication has been unsuccessful, click below to close this window and return to Gadwick.");
            setButtonClass("danger");
        }
    }, [])

    function onClose()
    {
        window.close();
    }

    return <div style={{ padding: 40 }}>
        <h1>{title}</h1>
        <p>{message}</p>
        <button className={buttonClass} onClick={onClose}>Done</button>
    </div>
}