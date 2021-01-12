import React, { useEffect } from 'react';
import Landing from './components/subviews/Landing/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './components/subviews/Legal/PrivacyPolicy';

function App()
{
  return <>
    <Router>
      <Header/>
      <Switch>
        <PrivateRoute path="/dashboard" ><Dashboard/></PrivateRoute>
        <Route path="/privacy-policy"><PrivacyPolicy/></Route>
        <Route path="/" ><Landing/></Route>
      </Switch>
    </Router>
  </>
}

export default App;
