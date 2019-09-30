import React, { Component } from 'react';

export class Dashboard extends Component {
   // constructor() {
   //    super();
   //    this.state = {
   //       loggedIn: false,
   //       characterID: '',
   //       characterName: ''
   //    }
   // }

   // componentDidMount() {
   //    const characterID = localStorage.characterID;
   //    const characterName = localStorage.characterName;

   //    if (!characterName) {
   //       console.log('User Not Logged In. Grabbing data');
   //       fetch('/api/user', {mode: 'cors'})
   //          .then(res => {
   //             console.log('DASHBOARD: ',res);
   //             return res.json();
   //          })
   //          .then(data => {
   //             console.log('DASHBOARD User: ',data);
   //             localStorage.setItem('characterID', data.characterID);
   //             localStorage.setItem('characterName', data.characterName);
   //             this.setState({characterID: data.characterID});
   //             this.setState({characterName: data.characterName});
   //          })
   //          .catch(err => {
   //             console.log('No info to display');
   //             // alert('Please Login First!')
   //             window.location.href = '/';
   //          });
   //    } else {
   //       console.log('User is Logged In');
   //       this.setState({characterID: characterID});
   //       this.setState({characterName: characterName});
   //       this.setState({loggedIn: true});
   //    }
   // }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>Welcome {this.props.characterName}<sup>({this.props.characterID})</sup>!</h2>
         </>
      );
   }
}

export default Dashboard;
