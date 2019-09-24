import React, { Component } from 'react';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         user: [],
         tokens: []
      }
   }
   componentDidMount() {
      fetch('/user', {mode: 'cors'})
         .then(res => {
            console.log(res);
            return res.json();
         })
         .then(user => {
            console.log(user);
            this.setState({ user });
         });
   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.state.user.CharacterName}!</h2>
         </>
      );
   }
}

export default Dashboard;
