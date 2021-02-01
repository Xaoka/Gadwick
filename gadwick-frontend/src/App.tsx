import React from 'react';
import LandingPage from './components/subviews/Landing/newLanding';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './components/subviews/Legal/PrivacyPolicy';
import Authenticated from './components/subviews/Redirect/Authenticated';

function App()
{
  return <>
    <Router>
      <Switch>
        <Route path="/auth-redirect">
          <Authenticated/>
        </Route>
        <PrivateRoute path="/dashboard" >
          <Header/>
          <Dashboard/>
        </PrivateRoute>
        <Route path="/privacy-policy">
          <Header/>
          <PrivacyPolicy/>
        </Route>
        <Route path="/" >
          <Header/>
          <LandingPage/>
        </Route>
      </Switch>
    </Router>
  </>
}

export default App;
