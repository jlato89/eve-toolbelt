import React, { Component } from 'react';
import Axios from 'axios';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         characterName: '',
         accessToken: '',
         apiResults: []
      }
   }

   componentDidMount() {
      //* Check if user is logged in
      const characterID = localStorage.characterID;
      const characterName = localStorage.characterName;
      const accessToken = localStorage.accessToken;

      if (!characterName || !characterID || !accessToken) {
         console.log('User Not Logged In. Grabbing data');
         fetch('/api/user', {mode: 'cors'})
            .then(res => {
               // console.log('DASHBOARD: ',res);
               return res.json();
            })
            .then(data => {
               console.log('DASHBOARD User: ',data);
               localStorage.setItem('characterID', data.characterID);
               localStorage.setItem('characterName', data.characterName);
               localStorage.setItem('accessToken', data.accessToken);
               this.setState({characterID: data.characterID});
               this.setState({characterName: data.characterName});
               this.setState({accessToken: data.accessToken});
            })
            .catch(err => {
               // console.log('No info to display');
               // alert('Please Login First!')
               window.location.href = '/';
            });
      } else {
         console.log('User is Logged In');
         this.setState({characterID: characterID});
         this.setState({characterName: characterName});
         this.setState({accessToken: accessToken });
      }

      //* Api call for user card
      const requests = {
         characterIsk: `/characters/${characterID}/wallet/`,
         characterLocation: `/characters/${characterID}/location/`,
         characterActiveShip: `/characters/${characterID}/ship/`,
         characterUnreadMailCount: `/characters/${characterID}/mail/labels/`,
         characterSkillQueue: `/characters/${characterID}/skillqueue/`,
      };
      const rawUrl = 'https://esi.evetech.net/latest';
      console.log('accessToken: \n',this.state.accessToken);

      Axios.get(`https://esi.evetech.net/latest/characters/95271542/wallet/`, {
         Headers: {
            Authorization: 'Bearer ' + this.state.accessToken
         }
      })
         .then(res => {
            console.log('res: ', res);
         })
         .catch(err => {
            console.log('err: ', err);
         });

      // for (const [key, value] of Object.entries(requests)) {
      //    const queryUrl = rawUrl+value;
      //    // console.log(key);
      //    // console.log(queryUrl);

      //    Axios.get(queryUrl + value, {
      //       headers: {
      //          Authorization: this.state.accessToken
      //       }
      //    })
      //    .then(res => {
      //       console.log(key,' : ',res);
      //    })
      // }
   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.state.characterName}<sup>({this.state.characterID})</sup>!</h2>
         </>
      );
   }
}

export default Dashboard;
