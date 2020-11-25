import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import history from '../utils/history';

export default function PrivateRoute(props: React.PropsWithChildren<{ path: string }>)
{
    const { isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        if (!isLoading && !isAuthenticated)
        {
            history.push("/");
        }
    }, [isLoading])

    return <Route path={props.path}>{isAuthenticated ? props.children : null}</Route>
}