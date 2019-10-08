import React, { Component } from 'react';

export class HomePage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loggedIn: false,
         characterName: ''
      };
   }

   render() {
      if (!this.state.loggedIn) {
         return (
            <>
               <h1>HomePage</h1>
               <a href='/auth/eveonline'>
                  <img
                     src='https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-black-large.png'
                     alt='login w/ eve button'
                  />
               </a>
            </>
         );
      } else {
         return (
            <>
               <h1>HomePage</h1>
               <h3>You are logged</h3>
            </>
         )
      }
   }
}

export default HomePage;
