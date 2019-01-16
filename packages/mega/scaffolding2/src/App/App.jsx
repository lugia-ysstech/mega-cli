import React, { Component } from 'react';
import reactLogo from '../assets/react.logo.svg';
import megaLogo from '../assets/logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={megaLogo} alt="mega-logo" />
          <span className="App-plus">+</span>
          <img src={reactLogo} className="App-logo" alt="react-logo" />
        </header>
        <h1 className="App-title">Lugia Mega of React</h1>
        <p className="App-intro">
          <code>React 实现</code> 标准、高效、开箱即用的前端可视化开发工具
        </p>
      </div>
    );
  }
}

export default App;
