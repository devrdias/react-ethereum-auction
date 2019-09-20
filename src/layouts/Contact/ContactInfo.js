import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'

class ContactInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {};
    this.state.contactInfo = {
      address: "adskflasjdf",
      abi: "klsdjflksdf",
      balance: "0.1 ETH",
      stores: 97,
      sellers: 98,
      arbiters: 99,
    }
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Contract Info</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {Object.keys(this.state.contactInfo).map((key) => <p as='h5' key={key}>{key}: {this.state.contactInfo[key]}</p>)}
          </div>
        </div>
      </main>
    )
  }
}

export default ContactInfo
