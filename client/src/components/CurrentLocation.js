import React, { Component } from 'react';
import axios from 'axios';

class CurrentLocation extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CurrentLocation: {},
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'location',
            })
            .then(res => {
               // console.log(res.data);
               return axios.post('/api/data', {
                  dataType: 'universe',
                  characterID: props.characterID,
                  endPoint: 'structures',
                  id: res.data.structure_id
               });
            })
            .then(res => {
               // console.log(res.data);
               this.setState({CurrentLocation: res.data});
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <>
            <strong>Current Location</strong> -<br />
            {this.state.CurrentLocation.name}
         </>
      );
   }
}

export default CurrentLocation;
