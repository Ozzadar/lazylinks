import React, { Component } from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import './App.css';
import {Glyphicon} from 'react-bootstrap';
import Home from './views/Home/Home'
import LazyRedirect from './views/LazyRedirect/LazyRedirect'
import LazyLinkStats from './views/LazyLinkStats/LazyLinkStats'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Link to='/' className="Home-button">
            <Glyphicon glyph="home" />
          </Link>
          <h1 className="App-title">LazyLinks</h1>
        </header>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/:lazylink' component={LazyRedirect} />
          <Route path='/:lazylink/stats' component={LazyLinkStats} />
        </Switch>
      </div>
    );
  }
}

export default App;
