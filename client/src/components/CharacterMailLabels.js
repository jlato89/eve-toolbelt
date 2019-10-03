import React, { Component } from 'react';
import axios from 'axios';

class CharacterMailLabels extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         CharacterMailLabels: {}
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
               this.setState({CharacterMailLabels: res.data})
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
               Unread Mail - {this.state.CharacterMailLabels.total_unread_count}
            </p>
         </div>
      );
   }
}

export default CharacterMailLabels;
