import React, { Component } from 'react';

export class HomePage extends Component {
   render() {
      return (
         <>
            <h1>HomePage</h1>
            <a href='http://localhost:8080/auth/eveonline'>
               <img
                  src='https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-black-large.png'
                  alt='login w/ eve button'
               />
            </a>
         </>
      );
   }
}

export default HomePage;
