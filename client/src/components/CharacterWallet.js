import React, { Component } from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format';

class Wallet extends Component {
   constructor() {
      super();
      this.state = {
         characterID: '',
         WalletIsk: ''
      };
   }

   UNSAFE_componentWillReceiveProps(props) {
      // Check if characterID exists
      if (props.characterID) {
         axios
            .post('/api/data', {
               dataType: 'characters',
               characterID: props.characterID,
               endPoint: 'wallet'
            })
            .then(res => {
               console.log(res.data);
               this.setState({WalletIsk: res.data})
            })
            .catch(err => console.log(err));
      } else {
         console.log('no character id');
      }
   }

   render() {
      return (
         <>
            <strong>Wallet Balance</strong> -<br />
            <NumberFormat
               value={this.state.WalletIsk}
               displayType={'text'}
               thousandSeparator={true}
               prefix={'$'}
            />
         </>
      );
   }
}

export default Wallet;
