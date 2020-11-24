import React, { useState } from 'react';
import Landing from './components/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';
import history from './utils/history';
import { Route, Router, Switch } from 'react-router-dom';

function App()
{
  const [loggedIn, setLoggedIn] = useState(false)
  function onLogin()
  {
    setLoggedIn(true);
    history.push("/dashboard")
  }

  function renderInnerPage()
  {
    if (!loggedIn)
    {
      return <Landing/>
    }
    else
    {
      return <Dashboard/>
    }
  }

  return <>
    <Router history={history}>
      <Header onClick={onLogin} loggedIn={loggedIn}/>
      <Switch>
        <Route path="/dashboard" ><Dashboard/></Route>
        <Route path="/login" ><Landing/></Route>
      </Switch>
      {/* {renderInnerPage()} */}
    </Router>
  </>
}

export default App;
