import React, { useEffect } from 'react';
import Landing from './components/subviews/Landing/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App()
{
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
