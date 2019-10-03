import React, { Component } from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format';

class Wallet extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         walletIsk: ''
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists and walletIsk doesnt
      if (props.characterID && !this.state.walletIsk) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'wallet'
            })
            .then(res => {
               console.log(res.data);
               this.setState({walletIsk: res.data})
            })
            .catch(err => console.log('Wallet.js AXIOS: ', err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <div>
            <p>
               Wallet Balance -{' '}
               <NumberFormat
                  value={this.state.walletIsk}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
               />
            </p>
         </div>
      );
   }
}

export default Wallet;
