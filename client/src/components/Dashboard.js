import React, { Component } from 'react';
import Axios from 'axios';
import CharacterPortrait from './CharacterPortrait';
// import CharacterMailLabels from './CharacterMailLabels';
import CharacterWallet from './CharacterWallet';
import CurrentLocation from './CurrentLocation';
import CurrentShip from './CurrentShip';

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
   }

   render() { 
      return (
         <>
            <h1>Dashboard Page</h1>
            <h2>
               Welcome {this.state.characterName}<sup>({this.state.characterID})</sup>!
            </h2>
            {/* <CharacterPortrait characterID={this.state.characterID} /> */}
            {/* <CharacterMailLabels characterID={this.state.characterID} /> */}
            {/* <Wallet characterID={this.state.characterID} /> */}
            {/* <CurrentLocation characterID={this.state.characterID} /> */}
            {/* <CurrentShip characterID={this.state.characterID} /> */}

            <div className='card' style={{ width: '18rem' }}>
               <CharacterPortrait characterID={this.state.characterID} />
               <ul className='list-group list-group-flush'>
                  {/* <li className='list-group-item'>
                     <CharacterMailLabels characterID={this.state.characterID} />
                  </li> */}
                  <li className='list-group-item'>
                     <CharacterWallet characterID={this.state.characterID} />
                  </li>
                  <li className='list-group-item'>
                     <CurrentLocation characterID={this.state.characterID} />
                  </li>
                  <li className='list-group-item'>
                     <CurrentShip characterID={this.state.characterID} />
                  </li>
               </ul>
            </div>
         </>
      );
   }
}

export default Dashboard;
