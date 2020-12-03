import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

export default function PrivateRoute(props: React.PropsWithChildren<{ path: string }>)
{
    const { isAuthenticated, isLoading } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
        {
            history.push("/");
        }
    }, [isLoading, isAuthenticated])

    return <Route path={props.path}>{isAuthenticated ? props.children : <div>Loading...</div>}</Route>
}