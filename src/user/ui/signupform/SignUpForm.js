import React, { Component } from 'react'
import ipfs from '../../../ipfs';
import store from '../../../store';

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
      profilePicture: '',
      userType: 'Buyer',
      buffer: '',
      ipfsHash: ''
    }
  }

  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  onInputChange(event) {
    console.log(event.target.id);
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState)
  }

  onRoleChange(event) {
    console.log(event.target.value);
    this.setState({
      userType: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    if (this.state.name.length < 2) {
      return alert('Please fill in your name.')
    }

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      this.setState({ ipfsHash: ipfsHash[0].hash });

      debugger;
      this.props.onSignUpFormSubmit(
        this.state.name,
        this.state.email,
        this.state.phoneNumber,
        this.state.ipfsHash,
        this.state.userType
      )
    }, (error, transactionHash) => {
      console.log(transactionHash);
      this.setState({ transactionHash });
    }) //await ipfs.add 
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <input id="name" type="text" value={this.state.name} onChange={this.onInputChange.bind(this)} placeholder="Name" required />
          <input id="email" type="email" value={this.state.email} onChange={this.onInputChange.bind(this)} placeholder="Email" required />
          <input id="phoneNumber" type="text" value={this.state.phoneNumber} onChange={this.onInputChange.bind(this)} placeholder="Phone Number" required />
          <input id="profilePicture" type="file" onChange={this.captureFile.bind(this)} placeholder="Profile Image" required />
          {/* <button type="upload" className="pure-button pure-button-primary" onClick={this.setIpfs.bind(this)}>Upload</button> */}
          <br />
          <label htmlFor="role">Your Role:</label>
          <label>
            <input type="radio" value="Buyer" checked={this.state.userType === 'Buyer'} onChange={this.onRoleChange.bind(this)} />
            Buyer
          </label>

          <label>
            <input type="radio" value="Seller" checked={this.state.userType === 'Seller'} onChange={this.onRoleChange.bind(this)} />
            Seller
          </label>

          <label>
            <input type="radio" value="Arbiter" checked={this.state.userType === 'Arbiter'} onChange={this.onRoleChange.bind(this)} />
            Arbiter
          </label>

          <br />

          <button type="submit" className="pure-button pure-button-primary">Sign Up</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUpForm
