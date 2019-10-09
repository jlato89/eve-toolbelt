import React, { Component } from 'react';
import axios from 'axios';

class CurrentShip extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CurrentShip: {}
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         const data = {};
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'ship'
            })
            .then(res => {
               console.log(res.data);
               data.ship_name = res.data.ship_name;
               data.ship_id = res.data.ship_type_id;

               return axios.post('/api/data', {
                  dataType: 'universe',
                  characterID: props.characterID,
                  endPoint: 'types',
                  id: res.data.ship_type_id
               });
            })
            .then(res => {
               // console.log(res.data);
               data.ship_type = res.data.name;
               this.setState({ CurrentShip: data });
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
            {this.state.CurrentShip.ship_name}(
            {this.state.CurrentShip.ship_type}) <br />
            <img
               src={`https://image.eveonline.com/Render/${this.state.CurrentShip.ship_id}_256.png`}
               alt='Current Ship'
            />
         </>
      );
   }
}

export default CurrentShip;
