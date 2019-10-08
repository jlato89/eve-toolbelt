import React, { Component } from 'react';
import axios from 'axios';

class CharacterMailLabels extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CharacterMailLabels: {},
         StaticData: {}
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'mail/labels'
            })
            .then(res => {
               console.log(res.data);
               this.setState({
                  CharacterMailLabels: res.data,
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
            <strong>Unread Mail</strong> -<br />
            {this.state.CharacterMailLabels.total_unread_count}
         </>
      );
   }
}

export default CharacterMailLabels;
