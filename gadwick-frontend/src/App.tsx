import React, { useEffect } from 'react';
import Landing from './components/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import { Route, BrowserRouter as Router, Switch, useHistory } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App()
{
  const history = useHistory();
  useEffect(() => {
    if (window.location.protocol === "http:" && window.location.hostname !== "localhost")
    {
      history.push(window.location.href.replace("http:", "https:"))
    }
  }, [])
  return <>
    <Router>
      <Header/>
      <Switch>
        <PrivateRoute path="/dashboard" ><Dashboard/></PrivateRoute>
        <Route path="/" ><Landing/></Route>
      </Switch>
    </Router>
  </>
}

export default App;
