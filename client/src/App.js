import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
import Login from './components/Login';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loggedIn: false,
         characterID: '',
         characterName: ''
      }
   }

   componentDidMount() {
      const characterID = localStorage.characterID;
      const characterName = localStorage.characterName;

      if (!characterName) {
         console.log('User Not Logged In. Grabbing data');
         fetch('/api/user', {mode: 'cors'})
            .then(res => {
               console.log('DASHBOARD: ',res);
               return res.json();
            })
            .then(data => {
               console.log('DASHBOARD User: ',data);
               localStorage.setItem('characterID', data.characterID);
               localStorage.setItem('characterName', data.characterName);
               this.setState({characterID: data.characterID});
               this.setState({characterName: data.characterName});
            })
            .catch(err => {
               console.log('No info to display');
               // alert('Please Login First!')
               window.location.href = '/';
            });
      } else {
         console.log('User is Logged In');
         this.setState({characterID: characterID});
         this.setState({characterName: characterName});
         this.setState({loggedIn: true});
      }
   }

   render() {
      return (
         <div>
            <Router>
               <Switch>
                  <Route exact path='/' component={HomePage} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/dashboard' user={this.state.characterName} component={Dashboard} />
                  <Route component={NoMatch} />
               </Switch>
            </Router>
         </div>
      );
   }
}

export default App;
