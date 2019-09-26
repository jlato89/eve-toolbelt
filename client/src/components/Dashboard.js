import React, { Component } from 'react';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         user: {},
         location: {}
      }
   }
   componentDidMount() {
      fetch('/api/user', {mode: 'cors'})
         .then(res => {
            console.log('DASHBOARD: ',res);
            return res.json();
         })
         .then(user => {
            console.log('DASHBOARD User: ',user);
            this.setState(user);
         })
         .catch(err => {
            console.log('No info to display');
            alert('Please Login First!')
            window.location.href = '/';
         });
   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.state.user.characterName}!</h2>
         </>
      );
   }
}

export default Dashboard;
