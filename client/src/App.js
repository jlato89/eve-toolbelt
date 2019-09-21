import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';

class App extends Component {
  render() {
    return (
       <div>
          <Router>
             <Switch>
                <Route exact path='/' component={HomePage} />
                <Route
                   exact path='/login' component={() => {
                     window.location.href =
                        'http://localhost:8080/auth/eveonline';
                   }}
                />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route component={NoMatch} />
             </Switch>
          </Router>
       </div>
    );
  }
}

export default App;
