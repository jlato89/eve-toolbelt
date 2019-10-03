import React, { Component } from 'react';
import Axios from 'axios';
import Wallet from './Wallet';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         characterName: '',
         apiData: {}
      }
   }

   componentDidMount() {
      //* Check if user is logged in
      const characterID = localStorage.characterID;
      const characterName = localStorage.characterName;

      if (!characterName || !characterID) {
         // console.log('User Not Logged In. Grabbing data');
         Axios('/api/user')
            .then(res => {
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
               alert('Please Login First!');
               window.location.href = '/';
            });
      } else {
         // console.log('User is Logged In');
         this.setState({characterID: characterID});
         this.setState({characterName: characterName});
      }

      //* Get API Data
      // Axios(`/api/eve/${characterID}`)
      //    .then(res => {
      //       console.log('API Data:\n',res.data);
      //       this.setState({apiData: res.data});
      //    })

   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.state.characterName}<sup>({this.state.characterID})</sup>!</h2>
            <Wallet characterID={this.state.characterID}/>
         </>
      );
   }
}

export default Dashboard;
