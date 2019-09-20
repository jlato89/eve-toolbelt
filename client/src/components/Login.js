import React, { Component } from 'react';
import axios from 'axios';

export class Login extends Component {

   constructor() {
      super();
      this.state = {
         pilot: '',
         errors: {}
      }

      axios
         .get('/api/login')
         .then(res => {
            console.log(res.data);
         })
         .catch(err => console.log('Login.js AXIOS: ',err));
   }

   render() {
      return (
         <div>
            <h1>Login Page</h1>\
         </div>
      )
   }
}

export default Login
