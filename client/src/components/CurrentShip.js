import React, { Component } from 'react';
import axios from 'axios';

class CurrentShip extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         currentShip: {}
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'ship'
            })
            .then(res => {
               console.log(res.data);
               this.setState({currentShip: res.data})
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <div>
            <p>
               Current Ship - SHIP({this.state.currentShip.ship_name})
            </p>
         </div>
      );
   }
}

export default CurrentShip;
