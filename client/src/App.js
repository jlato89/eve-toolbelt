import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
// import Login from './components/Login';

class App extends Component {
   constructor() {
      super();
      this.state = {
         isAuthenticated: false,
         currentUserId: ''
      };
   }

      // componentDidMount() {
      // fetch('/api/user', {mode: 'cors'})
      //    .then(res => {
      //       // console.log('DASHBOARD: ',res);
      //       return res.json();
      //    })
      //    .then(user => {
      //       // console.log('DASHBOARD User: ',user);
      //       this.setState({
      //          currentUserId: user.characterId
      //       });
      //    })
      //    .catch(err => {
      //       console.log('No info to display');
      //       alert('Please Login First!')
      //       window.location.href = '/';
      //    });
      // }

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
