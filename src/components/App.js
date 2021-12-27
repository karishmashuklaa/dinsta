import React, { Component } from 'react';
import Dinsta from '../abis/Dinsta.json';
import Header from './Header';
import Web3 from 'web3';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. Please install MetaMask.');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts[0])
    this.setState({ account: accounts[0] });

    // network ID
    const networkId = await web3.eth.net.getId();
    const networkData = Dinsta.networks[networkId];
    if (networkData) {
      const dinsta = web3.eth.Contract(Dinsta.abi, networkData.address);
      this.setState({ dinsta })
    }
    else {
      window.alert('Dinsta contract not deployed to detected network. Please check again.')
    }
  }

  constructor(props) {
    super(props);
    this.state = { 
      account: '', 
      dinsta: null, 
      images: [], 
      loading: true
     };
}

  render() {
    return (
      <>
        <Header />
      </>
    );
  }
}

export default App;
