import React, { Component } from 'react';
import Web3 from 'web3';
import Dinsta from '../abis/Dinsta.json';
import Header from './Header';
import Home from './Home';

//Declare IPFS
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

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
    // console.log("Account", accounts[0]);
    this.setState({ account: accounts[0] });
    // Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = Dinsta.networks[networkId];
    if (networkData) {
      const dinsta = new web3.eth.Contract(Dinsta.abi, networkData.address);
      this.setState({ dinsta });
      const imagesCount = await dinsta.methods.imageCount().call();
      this.setState({ imagesCount });
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await dinsta.methods.images(i).call();
        this.setState({
          images: [...this.state.images, image],
        });
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount),
      });
      this.setState({ loading: false });
    } else {
      window.alert('Dinsta contract not deployed to detected network.');
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log('buffer', this.state.buffer);
    };
  };

  uploadImage = (description) => {
    console.log('Submitting file to ipfs...');

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      this.state.dinsta.methods
        .uploadImage(result[0].hash, description)
        .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true });
    this.state.dinsta.methods
      .tipImageOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      dinsta: null,
      images: [],
      loading: true,
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.tipImageOwner = this.tipImageOwner.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  render() {
    return (
      <div>
        <Header account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center m-5 p-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Home
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
          />
        )}
      </div>
    );
  }
}

export default App;
