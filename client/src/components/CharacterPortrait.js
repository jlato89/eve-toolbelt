import React, { Component } from 'react';
import axios from 'axios';

class CharacterPortrait extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CharacterPortrait: {}
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'portrait'
            })
            .then(res => {
               console.log(res.data);
               this.setState({CharacterPortrait: res.data})
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <>
            <img
               src={this.state.CharacterPortrait.px256x256}
               className='card-img-top'
               alt='Character Portrait'
            ></img>
         </>
      );
   }
}

export default CharacterPortrait;
