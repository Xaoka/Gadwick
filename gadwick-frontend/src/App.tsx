import React, { useState } from 'react';
import Landing from './components/landing';
import Header from './components/header';
import Dashboard from './components/Dashboard';
import './App.css';

function App()
{
  const [loggedIn, setLoggedIn] = useState(false)
  function onLogin()
  {
    setLoggedIn(true);
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
    <Header onClick={onLogin} loggedIn={loggedIn}/>
    {renderInnerPage()}
  </>
}

export default App;
