import React, { Component } from 'react'
import ProfileFormContainer from '../../ui/profileform/ProfileFormContainer'

class Profile extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Account</h1>
            <p>Your account details are here.</p>
            <ProfileFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
