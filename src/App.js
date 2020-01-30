import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Popular from './pages/Popular';
import Battle from './pages/Battle';
// import Three from './pages/Three';
import ThreeImages from './pages/ThreeImages';

function App() {
  return (
    <Router>
      <div className="main-nav">
        <ul className="main-nav__list">
          <li className="main-nav__list-item">
            <Link className="main-nav__link" to="/popular">
              Popular
            </Link>
          </li>
          <li className="main-nav__list-item">
            <Link className="main-nav__link" to="/battle">
              Battle
            </Link>
          </li>
          <li className="main-nav__list-item">
            <Link className="main-nav__link" to="/three">
              Three
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <Switch>
          <Route exact path="/" render={() => <h1>Hello</h1>} />
          <Route exact path="/popular" component={Popular} />
          <Route exact path="/battle" component={Battle} />
          <Route exact path="/three" component={ThreeImages} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
