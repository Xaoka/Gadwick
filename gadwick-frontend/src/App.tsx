import React from 'react';
import Landing from './components/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import history from './utils/history';
import { Route, Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App()
{

  return <>
    <Router history={history}>
      <Header/>
      <Switch>
        <PrivateRoute path="/dashboard" ><Dashboard/></PrivateRoute>
        <Route path="/" ><Landing/></Route>
      </Switch>
      {/* {renderInnerPage()} */}
    </Router>
  </>
}

export default App;
