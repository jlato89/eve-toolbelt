import React, { Component } from 'react';
import axios from 'axios';

class CurrentShip extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CurrentShip: {},
         staticData: {}
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

               this.setState({
                  CurrentShip: res.data.data,
                  staticData: res.data.staticDataObj
               });
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <>
            <strong>Current Ship</strong> -<br />
            {this.state.staticData.inventory_type}(
            {this.state.CurrentShip.ship_name})
         </>
      );
   }
}

export default CurrentShip;
