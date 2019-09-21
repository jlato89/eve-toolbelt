import React, { Component } from 'react';
import axios from 'axios';

 class Login extends Component {

   componentDidMount() {
      // axios
      //    .get('auth/eveonline')
      //    .then(res => {

      //       console.log(res.data);
      //    })
      //    .catch(err => console.log('Login.js AXIOS: ', err));
      window.location.href = 'http://localhost:8080/auth/eveonline';
   }

   render() {
      return (
         <div>
            <h1>Login Page</h1>
         </div>
      )
   }
}

export default Login
