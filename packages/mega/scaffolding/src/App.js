import React, { Component } from 'react';
import reactLogo from './react.logo.svg';
import megaLogo from './mega.logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={megaLogo}
            style={{ height: '50px', margin: '15px' }}
            alt="mega-logo"
          />
          <img src={reactLogo} className="App-logo" alt="react-logo" />
          <h1 className="App-title">Lugia Mega && React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
