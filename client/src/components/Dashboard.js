import React, { Component } from 'react';

export class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         user: {},
         location: {}
      }
   }

   async componentDidMount() {
      await fetch('/api/user', {mode: 'cors'})
         .then(res => {
            // console.log('DASHBOARD: ',res);
            return res.json();
         })
         .then(user => {
            // console.log('DASHBOARD User: ',user);
            this.setState(user);
         })
         .catch(err => {
            console.log('No info to display');
            alert('Please Login First!')
            window.location.href = '/';
         });

      // console.log('UserId: ',this.state.user.characterName);
      // const userId = this.state.user.characterID;
      // const url = 'https://esi.evetech.net/latest/characters/'+userId+'/location';
      // await fetch('https://esi.evetech.net/latest/characters/'+this.state.user.characterID+'/location', {
      //    headers: {
      //       Authorization: 'Bearer '+this.state.user.accessToken
      //    }
      //    })
      //    .then(res => {
      //       return res.json()
      //    })
      //    .then(data => {
      //       console.log(data);
      //       if (data.sso_status === 401) {
      //          console.log('access Token Expired');
      //          fetch('https://login.eveonline.com/v2/oauth/token HTTP/1.1', {
      //             headers: {
      //                Content-Type: 'application/x-www-form-urlencoded',
      //                Host: 'login.eveonline.com',
      //                Authorization: 'Basic '+this.user.refreshToken 
      //             }
      //          })
      //             .then(res => {
      //                return res.json();
      //             })
      //             .then(token => {
      //                console.log('Token: ', token);
      //             });
      //       }
      //    })
      //    .catch(err => {
      //       console.log('ESI Err: \n',err);
      //    })
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
