import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from './Loading';

export default function PrivateRoute(props: React.PropsWithChildren<{ path: string }>)
{
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
        {
            // history.push("/");
            window.localStorage.setItem(`redirect`, window.location.href)
            loginWithRedirect({ redirectUri: `${window.location.origin}/dashboard/overview` });
        }
        else if (!isLoading && isAuthenticated)
        {
            let url = window.localStorage.getItem(`redirect`);
            if (url)
            {
                window.localStorage.removeItem(`redirect`);
                window.location.href = url;
            }
        }
    }, [isLoading, isAuthenticated])
    
    return <Route path={props.path}>{isAuthenticated ? props.children : <Loading/>}</Route>
}