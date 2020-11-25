import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function Header()
{
    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
    function onLogin()
    {
      // history.push("/dashboard")
      if (isAuthenticated)
      {
        logout({ returnTo: window.location.origin })
      }
      else
      {
        loginWithRedirect();
      }
    }
    const text = isAuthenticated ? "Log Out" : "Log In";
    return <div style={{ position: "absolute", top: 15, right: 15 }}>
        { isAuthenticated ? <span>Logged in as {user.name}</span> : null }
        <button onClick={onLogin}>{text}</button>
    </div>
}