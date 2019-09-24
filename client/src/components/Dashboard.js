import React, { Component } from 'react';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         user: {},
         tokens: {}
      }
   }
   componentDidMount() {
      fetch('/api/user', {mode: 'cors'})
         .then(res => {
            console.log('DASHBOARD: ',res);
            return res.json();
         })
         .then(user => {
            console.log('DASHBOARD: ',user);
            this.setState({ user });
         });
   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.state.user.name}!</h2>
            <h4>From {this.state.user.location}</h4>
         </>
      );
   }
}

export default Dashboard;
