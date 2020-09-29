import React, { useState } from 'react';
import Landing from './components/landing';
import Header from './components/header';
import Overview from './components/overview';
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
      return <Overview/>
    }
  }

  return <>
    <Header onClick={onLogin} loggedIn={loggedIn}/>
    <div style={{ padding: 35 }}>
      {renderInnerPage()}
    </div>
  </>
}

export default App;
