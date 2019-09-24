import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
import Login from './components/Login';

class App extends Component {
   // state = [
   //    (eveAccessToken = ''),
   //    (eveRefreshToken = ''),
   //    (eveCharacterId = ''), // 95271542
   //    (eveResults = [])
   // ];
   componentDidMount() {
      //    const accessToken = 'Bearer '+ {accessToken}
      //    const charId = {characterId};
      //    const requests = {requests}
      //    const queryURL =
      //       'https://esi.evetech.net/latest/characters/'+charId+'/'+requests+'/';
      //    axios.get(
      //       queryURL,
      //       {
      //          'Authorization': accessToken
      //       }
      //    );
   }

   render() {
      return (
         <div>
            <Router>
               <Switch>
                  <Route exact path='/' component={HomePage} />
                  <Route exact path='/login2' component={Login} />
                  <Route
                     exact
                     path='/login'
                     component={() => {
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
