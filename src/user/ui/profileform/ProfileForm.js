import React, { Component } from 'react'

class ProfileForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name,
      email: this.props.email,
      phoneNumber: this.props.phoneNumber,
      profilePicture: this.props.profilePicture,
      userType: this.props.userType,
      userState: this.props.userState
    }
  }

  onInputChange(event) {
    this.setState({ name: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2)
    {
      return alert('Please fill in your name.')
    }

    this.props.onProfileFormSubmit(this.state.name)
  }

  render() {
    const image = "https://gateway.ipfs.io/ipfs/" + this.state.profilePicture;
    console.log('imagem ' , image);
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <img alt="Profile picture" src={image}/>
          <label htmlFor="name">Name: <b>{this.state.name}</b></label>
          <label htmlFor="email">email: <b>{this.state.email}</b></label>
          <label htmlFor="phoneNumber">Phone: <b>{this.state.phoneNumber}</b></label>
          {/* <b>{this.state.profilePicture}</b> */}
          
          <label htmlFor="userType">User Type: <b>{this.state.userType}</b></label>
          <label htmlFor="userState">User State: <b>{this.state.userState}</b></label>
          <br/>
        </fieldset>
      </form>
    )
  }
}

export default ProfileForm
