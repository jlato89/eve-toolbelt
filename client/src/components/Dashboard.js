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
      let accessToken = localStorage.accessToken;

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

      //* Api call for data
      let results = [];
      for (const [key, value] of Object.entries(requests)) {
         const queryUrl = rawUrl+value;
         // console.log(key);
         // console.log(queryUrl);

               //* Api call for data
         Axios.get(queryUrl, {
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
         })
         .then(res => {
            // console.log(key,':\n', res);
            var newResult = {
               [key]: res.data
            }
            results.push(newResult);
         })
         .catch(err => {
            const errRes = err.response.data.error
            console.log(err.response);
            // If error is caused by "Token is expired" then have server refresh access token and send back new token.
            if (errRes === 'token is expired'){
               console.log('Token Expired, Sending token refresh call');
               Axios.get(`/api/token/${characterID}`)
               .then(res => {
                  localStorage.setItem('accessToken', res.data);
                  // this.setState({accessToken: res.data})
               })
               .catch(err => {
                  console.log(err);
               })
            }
         });
      }
      console.log('final Result: ', results);
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
