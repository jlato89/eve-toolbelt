import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
                  <Route exact path='/dashboard' component={Dashboard} />
                  <Route component={NoMatch} />
               </Switch>
            </Router>
         </div>
      );
   }
}

export default App;
