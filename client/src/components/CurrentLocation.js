import React, { Component } from 'react';
import axios from 'axios';

class CurrentLocation extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CurrentLocation: {}
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'location'
            })
            .then(res => {
               console.log(res.data);
               this.setState({CurrentLocation: res.data})
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
               Current Location - {this.state.CurrentLocation.structure_id} - {this.state.CurrentLocation.solar_system_id}
            </p>
         </div>
      );
   }
}

export default CurrentLocation;
