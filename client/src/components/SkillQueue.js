import React, { Component } from 'react';
import axios from 'axios';

class SkillQueue extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         SkillQueue: '',
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'skillqueue'
            })
            .then(res => {
               // console.log(res.data);
               return axios.post('/api/data', {
                  dataType: 'universe',
                  characterID: props.characterID,
                  endPoint: 'types',
                  id: res.data[0].skill_id
               });
            })
            .then(res => {
               // console.log(res.data);
               this.setState({SkillQueue: res.data.name});
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <>
            <strong>Skill Currently Training</strong> -<br />
            {this.state.SkillQueue}
         </>
      );
   }
}

export default SkillQueue;
